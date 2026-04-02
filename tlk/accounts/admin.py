from django.contrib import admin
from .models import CustomUser, Restaurant, MenuItem, PickupWindow, Order, OrderItem, BlogPost, Comment

admin.site.register(CustomUser)
admin.site.register(Restaurant)
admin.site.register(MenuItem)
admin.site.register(PickupWindow)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(BlogPost)
admin.site.register(Comment)
