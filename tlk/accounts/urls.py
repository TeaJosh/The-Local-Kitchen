from django.urls import path
from . import views

urlpatterns = [
    path('api/accounts/register/member/', views.register_member, name='register_member'),
    path('api/accounts/register/restaurant/', views.register_restaurant_owner, name='register_restaurant'),
    path('api/accounts/login/', views.login_view, name='login'),
    path('api/accounts/logout/', views.logout_view, name='logout'),
]
