from django.contrib.auth import authenticate, login, logout
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import CustomUser, Restaurant
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
        login(request, user)
        return JsonResponse({
            'message': 'Login successful',
            'username': user.username,
            'email': user.email,
            'profile_picture': request.build_absolute_uri(user.profile_picture.url) if user.profile_picture else None,
        })

    return JsonResponse({'error': 'Invalid credentials'}, status=400)


@csrf_exempt
def logout_view(request):
    if request.method != 'POST':
        return JsonResponse({'error': 'Invalid request method'}, status=400)

    logout(request)
    return JsonResponse({'message': 'Logged out successfully'})
