from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import CustomUser, Restaurant, BlogPost, Comment, AuthToken
from .decorators import token_required
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

#Restaurant Views

#List of active restaurants for members to browse. Admins can see all restaurants in admin panel.
@csrf_exempt
def restaurant_list(request):
    if request.method == 'GET':
        restaurants = Restaurant.objects.filter(is_active=True)
        data = []
        for r in restaurants:
            data.append({
                'id': r.id,
                'name': r.name,
                'address': r.address,
                'phone': r.phone,
                'description': r.description,
                'cuisine_type': r.cuisine_type,
                'opening_time': str(r.opening_time),
                'closing_time': str(r.closing_time),
            })
        return JsonResponse({'restaurants': data})
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)


#get the details of a specific restaurant, including menu items and pickup windows.
@csrf_exempt
def restaurant_detail(request, restaurant_id):
    if request.method == 'GET':
        try:
            restaurant = Restaurant.objects.get(id=restaurant_id, is_active=True)
            data = {
                'id': restaurant.id,
                'name': restaurant.name,
                'address': restaurant.address,
                'phone': restaurant.phone,
                'description': restaurant.description,
                'cuisine_type': restaurant.cuisine_type,
                'opening_time': str(restaurant.opening_time),
                'closing_time': str(restaurant.closing_time),
            }
            return JsonResponse({'restaurant': data})
        except Restaurant.DoesNotExist:
            return JsonResponse({'error': 'Restaurant not found'}, status=404)
    else:
        return JsonResponse({'error': 'Invalid request method'}, status=400)
    

#Blog views
@csrf_exempt
@token_required
def create_blog_post(request):
    if request.method == 'POST':
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Must be logged in to create a blog post'}, status=401)
        
        if request.user.role != CustomUser.MEMBER:
            return JsonResponse({'error': 'Must be a Member'}, status=403)

        data = json.loads(request.body)
        print("received data for blog post:", data)

        post = BlogPost.objects.create(
            author=request.user,
            title=data['title'],
            subheading=data.get('subheading', ''),
            image = data.get('image', ''),
            content=data['content'],
            section=data.get('section', 'guides'),
            cuisine=data.get('cuisine', 'all'),      
            occasion=data.get('occasion', 'all'),    
            city=data.get('city', ''),
            state=data.get('state', ''),
            allow_comments=data.get('allow_comments', True),
            is_anonymous=data.get('is_anonymous', False),
            is_draft=False,
            is_published=not data.get('is_draft', False)
        )

        return JsonResponse({
            'message': 'Blog Post Created',
            'post_id': post.id
        })
    
    return JsonResponse({'error': 'Invalid request method'}, status=400)

@csrf_exempt
@token_required
def delete_blog_post(request, post_id):
    if request.method == 'DELETE':
        if not request.user.is_authenticated:
            return JsonResponse({'error': 'Must be logged in to delete a blog post'}, status=401)
        
        try:
            post = BlogPost.objects.get(id=post_id)
        except BlogPost.DoesNotExist:
            return JsonResponse({'error': 'Blog post not found'}, status=404)

        if post.author != request.user:
            return JsonResponse({'error': 'You can only delete your own posts'}, status=403)

        post.delete()
        return JsonResponse({'message': 'Blog Post Deleted'})
    
    return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
def blog_post_detail(request, post_id):
    if request.method == 'GET':
        try:
            post = BlogPost.objects.get(id=post_id, is_published=True)

            if post.is_anonymous:
                author_name = "Anonymous"
            else:
                author_name = post.author.username
            
            #comments
            comments_data = []
            if post.allow_comments:
                for comment in Comment.objects.filter(post=post).order_by('created_at'):
                    comments_data.append({
                        'author': comment.author.username,
                        'content': comment.content,
                        'created_at': str(comment.created_at)
                    })

            data = {
                'id': post.id,
                'title': post.title,
                'subheading': post.subheading,
                'image': post.image,
                'content': post.content,
                'section': post.section,
                'cuisine': post.cuisine,        
                'occasion': post.occasion,      
                'author': author_name,
                'city': post.city,
                'state': post.state,
                'allow_comments': post.allow_comments,
                'comments': comments_data,
                'created_at': str(post.created_at),
                'updated_at': str(post.updated_at),
            }
            
            return JsonResponse({'post': data})
        except BlogPost.DoesNotExist:
            return JsonResponse({'error': 'Blog post not found'}, status=404)

    return JsonResponse({'error': 'Invalid request method'}, status=400)    


@csrf_exempt
def list_blog_posts(request):
    """GET /api/posts/ - List all published posts with optional filters"""
    if request.method == 'GET':
        posts = BlogPost.objects.filter(is_published=True)
        
        # Filter by category/section
        section = request.GET.get('section')
        if section and section != 'all':
            posts = posts.filter(section=section)
        
        # Filter by cuisine
        cuisine = request.GET.get('cuisine')
        if cuisine and cuisine != 'all':
            posts = posts.filter(cuisine=cuisine)
        
        # Filter by occasion
        occasion = request.GET.get('occasion')
        if occasion and occasion != 'all':
            posts = posts.filter(occasion=occasion)
        
        # Sort by recent or other
        sort = request.GET.get('sort', 'recent')
        if sort == 'recent':
            posts = posts.order_by('-created_at')
        
        data = []
        for post in posts:
            author_name = "Anonymous" if post.is_anonymous else post.author.username
            
            data.append({
                'id': post.id,
                'title': post.title,
                'subheading': post.subheading,
                'image': post.image,
                'section': post.section,
                'cuisine': post.cuisine,
                'occasion': post.occasion,
                'author': author_name,
                'city': post.city,
                'state': post.state,
                'created_at': str(post.created_at),
            })
        
        return JsonResponse({'posts': data})
    
    return JsonResponse({'error': 'Invalid request method'}, status=400)


@csrf_exempt
@token_required
def add_comment(request, post_id):
    if request.method == 'POST':

        if request.user.role != CustomUser.MEMBER:
            return JsonResponse({'error': 'Must be a Member'}, status=403)

        if request.user.is_banned:
            return JsonResponse({'error': 'Your account has been banned'}, status=403)
        
        try:
            post = BlogPost.objects.get(id=post_id, is_published=True)
        except BlogPost.DoesNotExist:
            return JsonResponse({'error': 'Blog post not found'}, status=404)

        
        if not post.allow_comments:
            return JsonResponse({'error': 'Comments are not allowed on this post'}, status=403)

        data = json.loads(request.body)

        comment = Comment.objects.create(
            post=post,  
            author=request.user,
            content=data['content']
        )

        return JsonResponse({
            'message': 'Comment added successfully',    
            'comment_id': comment.id
        })
    
    return JsonResponse({'error': 'Invalid request method'}, status=400) 


@csrf_exempt
@token_required
def delete_comment(request, comment_id):
    if request.method == 'DELETE':
        try:
            comment = Comment.objects.get(id=comment_id)

            if comment.author != request.user:
                return JsonResponse({'error': 'You can only delete your own comments'}, status=403)
            
            comment.delete()
            return JsonResponse({'message': 'Comment deleted successfully'})
        except Comment.DoesNotExist:
            return JsonResponse({'error': 'Comment not found'}, status=404)
        
    return JsonResponse({'error': 'Invalid request method'}, status=400)

