from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .decorators import token_required
from .models import CustomUser, Restaurant, BlogPost, AuthToken, Comment, BlogPostView, UserReport, ContactMessage
import json


@csrf_exempt
def register_member(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=400)

    data = json.loads(request.body)

    if CustomUser.objects.filter(email=data['email']).exists():
        return JsonResponse({'error': 'Email already in use'}, status=400)

    if CustomUser.objects.filter(username=data['username']).exists():
        return JsonResponse({'error': 'Username already in use'}, status=400)

    user = CustomUser.objects.create_user(
        email=data['email'],
        username=data['username'],
        password=data['password'],
        first_name=data.get('first_name', ''),
        last_name=data.get('last_name', ''),
        phone_number=data.get('phone_number', ''),
        role=CustomUser.MEMBER,
    )

    return JsonResponse({'message': 'Member registered successfully'}, status=201)


@csrf_exempt
def register_restaurant_owner(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=400)

    data = json.loads(request.body)

    if CustomUser.objects.filter(email=data['email']).exists():
        return JsonResponse({'error': 'Email already in use'}, status=400)

    if CustomUser.objects.filter(username=data['username']).exists():
        return JsonResponse({'error': 'Username already in use'}, status=400)

    user = CustomUser.objects.create_user(
        email=data['email'],
        username=data['username'],
        password=data['password'],
        first_name=data.get('first_name', ''),
        last_name=data.get('last_name', ''),
        phone_number=data.get('phone_number', ''),
        role=CustomUser.RESTAURANT,
    )

    Restaurant.objects.create(
        owner=user,
        name=data['restaurant_name'],
        address=data.get('restaurant_address', ''),
        phone=data.get('phone_number', ''),
        cuisine_type='',
        opening_time='09:00',
        closing_time='21:00',
    )

    return JsonResponse({'message': 'Restaurant registered successfully'}, status=201)


@csrf_exempt
def login_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=400)

    data = json.loads(request.body)
    identifier = data.get('email') or data.get('username')
    password = data.get('password')

    # Try email first, then username
    try:
        user_obj = CustomUser.objects.get(email=identifier)
    except CustomUser.DoesNotExist:
        try:
            user_obj = CustomUser.objects.get(username=identifier)
        except CustomUser.DoesNotExist:
            return JsonResponse({'error': 'Invalid credentials'}, status=400)

    user = authenticate(request, username=user_obj.email, password=password)

    if user is not None:
        token, _ = AuthToken.objects.get_or_create(user=user)
        login(request, user)
        return JsonResponse({
            'token': str(token.key),
            'message': 'Login successful',
            'username': user.username,
            'profile_picture': request.build_absolute_uri(user.profile_picture.url) if user.profile_picture else None,
        })

    return JsonResponse({'error': 'Invalid credentials'}, status=400)


@csrf_exempt
@token_required
def logout_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=400)

    logout(request)
    return JsonResponse({'message': 'Logged out successfully'})

#Account management views
@csrf_exempt
@token_required
def me(request):
    if request.method != 'GET':
        return JsonResponse({'error': 'Invalid request method'}, status=400)

    user = request.user
    return JsonResponse({
        'username': user.username,
        'email': user.email,
        'date_joined': str(user.date_joined),
    })


@csrf_exempt
@token_required
def change_email(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=400)

    data = json.loads(request.body)
    new_email = data.get('new_email')
    current_password = data.get('current_password')

    if not new_email or not current_password:
        return JsonResponse({'error': 'Email and password are required'}, status=400)

    user = authenticate(request, username=request.user.email, password=current_password)
    if user is None:
        return JsonResponse({'error': 'Password is incorrect'}, status=400)

    if CustomUser.objects.filter(email=new_email).exclude(pk=request.user.pk).exists():
        return JsonResponse({'error': 'Email already in use'}, status=400)

    request.user.email = new_email
    request.user.save()
    return JsonResponse({'message': 'Email updated successfully'})


@csrf_exempt
@token_required
def change_password(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=400)

    data = json.loads(request.body)
    current_password = data.get('current_password')
    new_password = data.get('new_password')

    if not current_password or not new_password:
        return JsonResponse({'error': 'Both current and new password are required'}, status=400)

    user = authenticate(request, username=request.user.email, password=current_password)
    if user is None:
        return JsonResponse({'error': 'Current password is incorrect'}, status=400)

    request.user.set_password(new_password)
    request.user.save()
    return JsonResponse({'message': 'Password updated successfully'})


@csrf_exempt
@token_required
def delete_account(request):
    if request.method != 'DELETE':
        return JsonResponse({'error': 'Invalid request method'}, status=400)

    request.user.delete()
    return JsonResponse({'message': 'Account deleted successfully'})


@csrf_exempt
@token_required
def create_blog_post(request):
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Must be logged in'}, status=401)

        if request.user.role != CustomUser.MEMBER:
            return JsonResponse({'error': 'Must be a Member'}, status=403)

        data = json.loads(request.body)

        post = BlogPost.objects.create(
            author=request.user,
            title=data['title'],
            subheading=data.get('subheading') or '',
            image=data.get('image') or '',
            content=data['content'],
            section=data.get('section') or 'guides',
            vibe=data.get('vibe') or 'cozy',
            cuisine=data.get('cuisine') or 'All',
            occasion=data.get('occasion') or 'All',
            city=data.get('city') or '',
            state=data.get('state') or '',
            allow_comments=data.get('allow_comments', True),
            is_anonymous=data.get('is_anonymous', False),
            is_draft=False,
            is_published=not data.get('is_draft', False)
        )

        return JsonResponse({'message': 'Blog Post Created', 'post_id': post.id})

    return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
@token_required
def delete_blog_post(request, post_id):
    if request.method == 'DELETE':
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Must be logged in'}, status=401)

        try:
            post = BlogPost.objects.get(id=post_id)
        except BlogPost.DoesNotExist:
            return JsonResponse({'error': 'Not found'}, status=404)

        if post.author != request.user:
            return JsonResponse({'error': 'Not allowed'}, status=403)

        post.delete()
        return JsonResponse({'message': 'Deleted'})

    return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def blog_post_detail(request, post_id):
    if request.method == 'GET':
        try:
            post = BlogPost.objects.get(id=post_id, is_published=True)

            #tracking view count for registered users, but not for anonymous users
            if request.user.is_authenticated:
                _, created = BlogPostView.objects.get_or_create(post=post, user=request.user)
                if created:
                    post.view_count += 1
                    post.save(update_fields=['view_count'])

            author_name = "Anonymous" if post.is_anonymous else post.author.username

            comments_data = []
            if post.allow_comments:
                comments_data = [
                    {
                        'author': c.author.username,
                        'content': c.content,
                        'created_at': str(c.created_at)
                    }
                    for c in Comment.objects.filter(post=post).order_by('created_at')
                ]

            return JsonResponse({
                'post': {
                    'id': post.id,
                    'title': post.title,
                    'subheading': post.subheading,
                    'image': post.image,
                    'content': post.content,
                    'section': post.section,
                    'cuisine': post.cuisine,
                    'vibe': post.vibe,
                    'occasion': post.occasion,
                    'author': {
                            'username': author_name,
                            'image': request.build_absolute_uri(post.author.profile_picture.url)
                                if post.author.profile_picture else None,
                    } if not post.is_anonymous else {'username': 'Anonymous', 'image': None},
                    'city': post.city,
                    'state': post.state,
                    'allow_comments': post.allow_comments,
                    'is_editors_pick': post.is_editors_pick,
                    'view_count': post.view_count,
                    'comments': comments_data,
                    'created_at': str(post.created_at),
                    'updated_at': str(post.updated_at),
                }
            })

        except BlogPost.DoesNotExist:
            return JsonResponse({'error': 'Not found'}, status=404)

    return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def list_blog_posts(request):
    if request.method == 'GET':
        posts = BlogPost.objects.filter(is_published=True)

        section = request.GET.get('section')
        vibe = request.GET.get('vibe')
        cuisine = request.GET.get('cuisine')
        occasion = request.GET.get('occasion')
        sort = request.GET.get('sort', 'recent')

        if section and section != 'all':
            posts = posts.filter(section=section)
        if cuisine and cuisine != 'all':
            posts = posts.filter(cuisine=cuisine)
        if occasion and occasion != 'all':
            posts = posts.filter(occasion=occasion)
        if sort == 'recent':
            posts = posts.order_by('-created_at')

    #trending criteria, 40% or more of members have viewed it, and order by view percentage
    if sort == 'trending':
        from django.db.models import Count, F, FloatField, ExpressionWrapper
    
        total_members = CustomUser.objects.filter(role=CustomUser.MEMBER).count()
    
        if total_members > 0:
            posts = posts.annotate(
                view_percentage=ExpressionWrapper(F('view_count') * 100.0 / total_members,output_field=FloatField())
        ).filter(view_percentage__gte=40).order_by('-view_percentage') # 40% or more of members have viewed it
        else:
            posts = posts.none()
    else:
        posts = posts.order_by('-created_at')


        data = [
            {
                'id': p.id,
                'title': p.title,
                'subheading': p.subheading,
                'image': p.image,
                'section': p.section,
                'cuisine': p.cuisine,
                'vibe': p.vibe,
                'occasion': p.occasion,
                'author': "Anonymous" if p.is_anonymous else p.author.username,
                'city': p.city,
                'state': p.state,
                'is_editors_pick': p.is_editors_pick,
                'view_count': p.view_count,
                'created_at': str(p.created_at),
            }
            for p in posts
        ]

        return JsonResponse({'posts': data})

    return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def post_comments(request, post_id):
    try:
        post = BlogPost.objects.get(id=post_id, is_published=True)
    except BlogPost.DoesNotExist:
        return JsonResponse({'error': 'Not found'}, status=404)

    # ---- LIST (public) ----
    if request.method == 'GET':
        comments = Comment.objects.filter(post=post).order_by('-created_at')
        return JsonResponse({
            'comments': [
                {
                    'id': c.id,
                    'author': c.author.username,
                    'content': c.content,
                    'created_at': c.created_at.isoformat(),
                }
                for c in comments
            ]
        })

    # ---- CREATE (auth required) ----
    if request.method == 'POST':
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Authorization required'}, status=401)

        token_key = auth_header.split(' ')[1]
        try:
            token = AuthToken.objects.get(key=token_key)
            user = token.user
        except AuthToken.DoesNotExist:
            return JsonResponse({'error': 'Invalid or expired token'}, status=401)

        if user.role != CustomUser.MEMBER:
            return JsonResponse({'error': 'Must be a Member'}, status=403)

        if user.is_banned:
            return JsonResponse({'error': 'Banned'}, status=403)

        if not post.allow_comments:
            return JsonResponse({'error': 'Comments disabled'}, status=403)

        data = json.loads(request.body)
        comment = Comment.objects.create(
            post=post,
            author=user,
            content=data['content']
        )

        return JsonResponse({'message': 'Comment added', 'comment_id': comment.id})

    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
@token_required
def delete_comment(request, comment_id):
    if request.method == 'DELETE':
        try:
            comment = Comment.objects.get(id=comment_id)

            if comment.author != request.user:
                return JsonResponse({'error': 'Not allowed'}, status=403)

            comment.delete()
            return JsonResponse({'message': 'Deleted'})

        except Comment.DoesNotExist:
            return JsonResponse({'error': 'Not found'}, status=404)

    return JsonResponse({'error': 'Invalid request method'}, status=400)

#Report and contact views
@csrf_exempt
def contact_submit(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=400)

    data = json.loads(request.body)

    ContactMessage.objects.create(
        reporter=data.get('reporter', 'Anonymous'),
        full_name=data.get('full_name', ''),
        email=data.get('email', ''),
        phone_number=data.get('phoneNumber', ''),
        subject=data.get('subject', ''),
        message=data.get('message', ''),
    )

    return JsonResponse({'message': 'Contact message submitted successfully'})


@csrf_exempt
def report_user(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=400)

    data = json.loads(request.body)

    UserReport.objects.create(
        reporter=data.get('reporter', 'Anonymous'),
        subject=data.get('subject', ''),
        reported_user=data.get('reported_user', ''),
        content_link=data.get('content_link', ''),
        incident_date=data.get('incident_date') or None,
        violation_types=data.get('violation_types', []),
        description=data.get('description', ''),
    )

    return JsonResponse({'message': 'Report submitted successfully'})

# Profile Page Views
@csrf_exempt
@token_required
def get_profile(request):
    if request.method != "GET":
        return JsonResponse({"error": "Invalid request method"}, status=400)

    user = request.user

    return JsonResponse({
        "profile": {
            "id": user.id,
            "username": user.username,
            "email": user.email,
            "first_name": user.first_name,
            "last_name": user.last_name,
            "phone_number": getattr(user, "phone_number", ""),
            "bio": getattr(user, "bio", ""),
            "address1": getattr(user, "address1", ""),
            "address2": getattr(user, "address2", ""),
            "zip": getattr(user, "zip_code", ""),
            "city": getattr(user, "city", ""),
            "state": getattr(user, "state", ""),
            "role": user.role,
            "image": request.build_absolute_uri(user.profile_picture.url)
                if getattr(user, "profile_picture", None) else None,
        }
    })


@csrf_exempt
@token_required
def update_profile(request):
    if request.method not in ["PUT", "PATCH", "POST"]:
        return JsonResponse({"error": "Invalid request method"}, status=400)

    user = request.user

    data = request.POST  # works for FormData
    files = request.FILES

    user.username = data.get("username", user.username)
    user.email = data.get("email", user.email)
    user.first_name = data.get("first_name", user.first_name)
    user.last_name = data.get("last_name", user.last_name)
    user.phone_number = data.get("phone_number", getattr(user, "phone_number", ""))
    user.bio = data.get("bio", getattr(user, "bio", ""))
    user.address1 = data.get("address1", getattr(user, "address1", ""))
    user.address2 = data.get("address2", getattr(user, "address2", ""))
    user.zip_code = data.get("zip", getattr(user, "zip_code", ""))
    user.city = data.get("city", getattr(user, "city", ""))
    user.state = data.get("state", getattr(user, "state", ""))

    # ✅ IMAGE FIX
    if "profile_picture" in files:
        user.profile_picture = files["profile_picture"]

    user.save()

    return JsonResponse({"message": "Profile updated successfully"})