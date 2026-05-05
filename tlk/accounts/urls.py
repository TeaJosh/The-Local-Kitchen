from django.urls import path
from . import views

urlpatterns = [
    # Account URLs
    path('api/accounts/register/member/', views.register_member, name='register_member'),
    path('api/accounts/register/restaurant/', views.register_restaurant_owner, name='register_restaurant'),
    path('api/accounts/login/', views.login_view, name='login'),
    path('api/accounts/logout/', views.logout_view, name='logout'),

    # Blog URLs
    path('api/posts/', views.list_blog_posts, name='list_posts'),
    path('api/posts/create/', views.create_blog_post, name='create_post'),
    path('api/posts/<int:post_id>/', views.blog_post_detail, name='post_detail'),
    path('api/posts/<int:post_id>/delete/', views.delete_blog_post, name='delete_post'),
    path('api/posts/<int:post_id>/update/', views.update_blog_post, name='update_post'),

    # Blog Comment URLs
    path('api/posts/<int:post_id>/comments/', views.post_comments, name='post_comments'),
    path('api/comments/<int:comment_id>/', views.delete_comment, name='delete_comment'),

    # Account Management views
    path('api/accounts/me/', views.me, name='me'),
    path('api/accounts/change_email/', views.change_email, name='change_email'),
    path('api/accounts/change_password/', views.change_password, name='change_password'),
    path('api/accounts/delete/', views.delete_account, name='delete_account'),

    # Report and Contact URLs
    path('api/support/report-user/', views.report_user, name='report_user'),
    path('api/contact/', views.contact_submit, name='contact_submit'),

    # Profile Page Urls
    path('api/accounts/profile/', views.get_profile, name='get_profile'),
    path('api/accounts/profile/update/', views.update_profile, name='update_profile'),
]
