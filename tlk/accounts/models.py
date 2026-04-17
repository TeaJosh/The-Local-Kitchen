from django.db import models
from django.contrib.auth.models import User, Group
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager, PermissionsMixin
import uuid


# USER PROFILES
class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError("Email is required")
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractBaseUser, PermissionsMixin):
    MEMBER = "member"
    RESTAURANT = "restaurant"
    ROLE_CHOICES = [
        (MEMBER, "Member"),
        (RESTAURANT, "Restaurant"),
    ]

    email = models.EmailField(unique=True)
    username = models.CharField(max_length=50, unique=True)
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    phone_number = models.CharField(max_length=20, blank=True)
    profile_picture = models.ImageField(upload_to="profile_pictures/", blank=True, null=True)
    date_of_birth = models.DateField(blank=True, null=True)
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default=MEMBER)
    bio = models.TextField(blank=True)
    strikes = models.IntegerField(default=0)
    is_banned = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)
    is_staff = models.BooleanField(default=False)
    date_joined = models.DateTimeField(auto_now_add=True)

    objects = CustomUserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["username", "first_name", "last_name"]

    def __str__(self):
        return self.email


class Restaurant(models.Model):
    owner = models.ForeignKey(CustomUser, on_delete=models.CASCADE, limit_choices_to={"role": "restaurant"})
    name = models.CharField(max_length=200)
    address = models.CharField(max_length=300)
    phone = models.CharField(max_length=20)
    description = models.TextField(blank=True)
    cuisine_type = models.CharField(max_length=100)
    opening_time = models.TimeField()
    closing_time = models.TimeField()
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class MenuItem(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    name = models.CharField(max_length=200)
    description = models.TextField(blank=True)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    category = models.CharField(max_length=100)
    is_available = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} - ${self.price}"


class PickupWindow(models.Model):
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    date = models.DateField()
    start_time = models.TimeField()
    end_time = models.TimeField()
    max_orders = models.IntegerField(default=10)

    def __str__(self):
        return f"{self.restaurant.name} - {self.date} {self.start_time}"


class Order(models.Model):
    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("ready", "Ready"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    customer = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="orders")
    restaurant = models.ForeignKey(Restaurant, on_delete=models.CASCADE)
    pickup_window = models.ForeignKey(PickupWindow, on_delete=models.CASCADE)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default="pending")
    total = models.DecimalField(max_digits=8, decimal_places=2)
    notes = models.TextField(blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.id} - {self.customer}"


class OrderItem(models.Model):
    order = models.ForeignKey(Order, on_delete=models.CASCADE)
    menu_item = models.ForeignKey(MenuItem, on_delete=models.CASCADE)
    quantity = models.IntegerField(default=1)
    price_at_order = models.DecimalField(max_digits=6, decimal_places=2)
    special_instructions = models.TextField(blank=True)

    def __str__(self):
        return f"{self.quantity}x {self.menu_item.name}"

# BLOG
class BlogPost(models.Model):
    SECTION_CHOICES = [
        ('guides', 'Guides'),
        ('reviews', 'Reviews'),
        ('news', 'News'),
    ]

    OCCASION_CHOICES = [
        ('date_night', 'Date Night'),
        ('fine_dining', 'Fine Dining'),
        ('group_dining', 'Group Dining'),
        ('quick_bite', 'Quick Bite'),
        ('business', 'Business'),
    ]

    CUISINE_CHOICES = [
        ('all', 'All Cuisines'),
        ('american', 'American'),
        ('bar', 'Bar'),
        ('italian', 'Italian'),
        ('asian', 'Asian'),
        ('pizza', 'Pizza'),
        ('japanese', 'Japanese'),
        ('chinese', 'Chinese'),
        ('mexican', 'Mexican'),
        ('seafood', 'Seafood'),
        ('sushi', 'Sushi'),
        ('cafe', 'Cafe'),
        ('fast_food', 'Fast Food'),
        ('french', 'French'),
        ('indian', 'Indian'),
        ('thai', 'Thai'),
        ('korean', 'Korean'),
        ('middle_eastern', 'Middle Eastern'),
        ('greek', 'Greek'),
        ('fusion', 'Fusion'),
        ('barbecue', 'Barbecue'),
        ('vietnamese', 'Vietnamese'),
        ('turkish', 'Turkish'),
        ('ethiopian', 'Ethiopian'),
        ('brazilian', 'Brazilian'),
        ('german', 'German'),
        ('british', 'British'),
        ('other', 'Other'),
    ]

    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    restaurant = models.ForeignKey(Restaurant, on_delete=models.SET_NULL, null=True, blank=True)

    title = models.CharField(max_length=300)
    subheading = models.CharField(max_length=500, blank=True)
    image = models.URLField(max_length=500, blank=True, null=True, default='')
    content = models.TextField()

    section = models.CharField(max_length=50, choices=SECTION_CHOICES, default='guides')
    cuisine = models.CharField(max_length=50, choices=CUISINE_CHOICES, default='all')
    occasion = models.CharField(max_length=50, choices=OCCASION_CHOICES, default='all')

    city = models.CharField(max_length=100, blank=True)
    state = models.CharField(max_length=100, blank=True)

    allow_comments = models.BooleanField(default=True)
    is_anonymous = models.BooleanField(default=False)

    is_draft = models.BooleanField(default=False)
    is_published = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.title
        
class Comment(models.Model):
    post = models.ForeignKey(BlogPost, on_delete=models.CASCADE)
    author = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author.user.username} on {self.post.title}"

# Token Authentication
class AuthToken(models.Model):
    user = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    key = models.CharField(max_length=64, unique=True, default=uuid.uuid4) #generate a unique token key using uuid4
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Token for {self.user.email}"
