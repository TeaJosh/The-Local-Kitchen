from django.contrib import admin
from .models import CustomUser, Restaurant, MenuItem, PickupWindow, Order, OrderItem, BlogPost, Comment, BlogPostView, ContactMessage, UserReport

admin.site.register(CustomUser)
admin.site.register(Restaurant)
admin.site.register(MenuItem)
admin.site.register(PickupWindow)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(Comment)
admin.site.register(BlogPostView)


class BlogPostAdmin(admin.ModelAdmin):
    list_display = ('title', 'author', 'is_editors_pick', 'view_count', 'created_at')
    list_filter = ('is_editors_pick', 'section', 'vibe')
    list_editable = ('is_editors_pick',)  # Toggle right from the list page

admin.site.register(BlogPost, BlogPostAdmin)
admin.site.register(ContactMessage)
admin.site.register(UserReport)
