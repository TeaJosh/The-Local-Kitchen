from django.test import TestCase, Client
from .models import CustomUser, BlogPost, Comment, AuthToken
import json
 
 
class LoginTests(TestCase):
    """Tests for login and token generation"""
 
    def setUp(self):
        self.client = Client()
        self.user = CustomUser.objects.create_user(
            email='test@test.com',
            username='testuser',
            password='testpass123',
            first_name='John',
            last_name='Doe',
            role=CustomUser.MEMBER,
        )
 
    def test_login_with_email(self):
        res = self.client.post('/api/accounts/login/', json.dumps({
            'email': 'test@test.com',
            'password': 'testpass123',
        }), content_type='application/json')
        self.assertEqual(res.status_code, 200)
        data = res.json()
        self.assertIn('token', data)
        self.assertEqual(data['username'], 'testuser')
 
    def test_login_with_username(self):
        res = self.client.post('/api/accounts/login/', json.dumps({
            'username': 'testuser',
            'password': 'testpass123',
        }), content_type='application/json')
        self.assertEqual(res.status_code, 200)
        self.assertIn('token', res.json())
 
    def test_login_wrong_password(self):
        res = self.client.post('/api/accounts/login/', json.dumps({
            'email': 'test@test.com',
            'password': 'wrongpassword',
        }), content_type='application/json')
        self.assertEqual(res.status_code, 400)
        self.assertIn('Invalid credentials', res.json()['error'])
 
    def test_login_nonexistent_user(self):
        res = self.client.post('/api/accounts/login/', json.dumps({
            'email': 'nobody@test.com',
            'password': 'testpass123',
        }), content_type='application/json')
        self.assertEqual(res.status_code, 400)
 
    def test_login_wrong_method(self):
        res = self.client.get('/api/accounts/login/')
        self.assertEqual(res.status_code, 400)
 
    def test_login_creates_token(self):
        self.client.post('/api/accounts/login/', json.dumps({
            'email': 'test@test.com',
            'password': 'testpass123',
        }), content_type='application/json')
        self.assertTrue(AuthToken.objects.filter(user=self.user).exists())
 
    def test_login_returns_same_token(self):
        """Logging in twice should return the same token"""
        res1 = self.client.post('/api/accounts/login/', json.dumps({
            'email': 'test@test.com',
            'password': 'testpass123',
        }), content_type='application/json')
        res2 = self.client.post('/api/accounts/login/', json.dumps({
            'email': 'test@test.com',
            'password': 'testpass123',
        }), content_type='application/json')
        self.assertEqual(res1.json()['token'], res2.json()['token'])
 
 
class TokenAuthTests(TestCase):
    """Tests for the token_required decorator"""
 
    def setUp(self):
        self.client = Client()
        self.user = CustomUser.objects.create_user(
            email='test@test.com',
            username='testuser',
            password='testpass123',
            first_name='John',
            last_name='Doe',
            role=CustomUser.MEMBER,
        )
        self.token = AuthToken.objects.create(user=self.user)
 
    def test_request_with_valid_token(self):
        res = self.client.post('/api/posts/create/', json.dumps({
            'title': 'Test Post',
            'content': '<p>Hello</p>',
        }), content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {self.token.key}')
        self.assertEqual(res.status_code, 200)
 
    def test_request_with_no_token(self):
        res = self.client.post('/api/posts/create/', json.dumps({
            'title': 'Test Post',
            'content': '<p>Hello</p>',
        }), content_type='application/json')
        self.assertEqual(res.status_code, 401)
 
    def test_request_with_invalid_token(self):
        res = self.client.post('/api/posts/create/', json.dumps({
            'title': 'Test Post',
            'content': '<p>Hello</p>',
        }), content_type='application/json',
            HTTP_AUTHORIZATION='Bearer fake-token-12345')
        self.assertEqual(res.status_code, 401)
 
    def test_request_with_malformed_header(self):
        res = self.client.post('/api/posts/create/', json.dumps({
            'title': 'Test Post',
            'content': '<p>Hello</p>',
        }), content_type='application/json',
            HTTP_AUTHORIZATION='NotBearer something')
        self.assertEqual(res.status_code, 401)
 
 
class BlogPostTests(TestCase):
    """Tests for blog post CRUD"""
 
    def setUp(self):
        self.client = Client()
        self.user = CustomUser.objects.create_user(
            email='blogger@test.com',
            username='blogger',
            password='testpass123',
            first_name='Jane',
            last_name='Doe',
            role=CustomUser.MEMBER,
        )
        self.token = AuthToken.objects.create(user=self.user)
        self.auth_header = f'Bearer {self.token.key}'
 
    def _create_post(self, **overrides):
        """Helper to create a published blog post"""
        defaults = {
            'author': self.user,
            'title': 'Test Post',
            'content': '<p>Test content</p>',
            'is_published': True,
        }
        defaults.update(overrides)
        return BlogPost.objects.create(**defaults)
 
    # --- Create ---
 
    def test_create_blog_post(self):
        res = self.client.post('/api/posts/create/', json.dumps({
            'title': 'My First Post',
            'content': '<p>Hello world</p>',
            'section': 'guides',
            'cuisine': 'pizza',
            'city': 'Minneapolis',
            'state': 'Minnesota',
        }), content_type='application/json',
            HTTP_AUTHORIZATION=self.auth_header)
        self.assertEqual(res.status_code, 200)
        self.assertIn('post_id', res.json())
        post = BlogPost.objects.get(id=res.json()['post_id'])
        self.assertEqual(post.title, 'My First Post')
        self.assertEqual(post.author, self.user)
        self.assertTrue(post.is_published)
 
    def test_create_blog_post_as_draft(self):
        res = self.client.post('/api/posts/create/', json.dumps({
            'title': 'Draft Post',
            'content': '<p>Work in progress</p>',
            'is_draft': True,
        }), content_type='application/json',
            HTTP_AUTHORIZATION=self.auth_header)
        self.assertEqual(res.status_code, 200)
        post = BlogPost.objects.get(id=res.json()['post_id'])
        self.assertFalse(post.is_published)
 
    def test_create_blog_post_restaurant_role_rejected(self):
        restaurant_user = CustomUser.objects.create_user(
            email='owner@test.com',
            username='owner',
            password='testpass123',
            first_name='Bob',
            last_name='Smith',
            role=CustomUser.RESTAURANT,
        )
        token = AuthToken.objects.create(user=restaurant_user)
        res = self.client.post('/api/posts/create/', json.dumps({
            'title': 'Should Fail',
            'content': '<p>Not allowed</p>',
        }), content_type='application/json',
            HTTP_AUTHORIZATION=f'Bearer {token.key}')
        self.assertEqual(res.status_code, 403)
 
    def test_create_blog_post_wrong_method(self):
        res = self.client.get('/api/posts/create/',
                              HTTP_AUTHORIZATION=self.auth_header)
        self.assertEqual(res.status_code, 400)
 
    # --- List ---
 
    def test_list_blog_posts(self):
        self._create_post(title='Post One')
        self._create_post(title='Post Two')
        res = self.client.get('/api/posts/')
        self.assertEqual(res.status_code, 200)
        posts = res.json()['posts']
        self.assertEqual(len(posts), 2)
 
    def test_list_blog_posts_excludes_unpublished(self):
        self._create_post(title='Published', is_published=True)
        self._create_post(title='Draft', is_published=False)
        res = self.client.get('/api/posts/')
        posts = res.json()['posts']
        self.assertEqual(len(posts), 1)
        self.assertEqual(posts[0]['title'], 'Published')
 
    def test_list_blog_posts_filter_by_section(self):
        self._create_post(title='Guide Post', section='guides')
        self._create_post(title='News Post', section='news')
        res = self.client.get('/api/posts/?section=guides')
        posts = res.json()['posts']
        self.assertEqual(len(posts), 1)
        self.assertEqual(posts[0]['title'], 'Guide Post')
 
    def test_list_blog_posts_filter_by_cuisine(self):
        self._create_post(title='Pizza Post', cuisine='pizza')
        self._create_post(title='Sushi Post', cuisine='sushi')
        res = self.client.get('/api/posts/?cuisine=pizza')
        posts = res.json()['posts']
        self.assertEqual(len(posts), 1)
        self.assertEqual(posts[0]['title'], 'Pizza Post')
 
    def test_list_blog_posts_anonymous_author(self):
        self._create_post(title='Secret Post', is_anonymous=True)
        res = self.client.get('/api/posts/')
        posts = res.json()['posts']
        self.assertEqual(posts[0]['author'], 'Anonymous')
 
    # --- Detail ---
 
    def test_blog_post_detail(self):
        post = self._create_post(title='Detail Post', city='Minneapolis', state='Minnesota')
        res = self.client.get(f'/api/posts/{post.id}/')
        self.assertEqual(res.status_code, 200)
        data = res.json()['post']
        self.assertEqual(data['title'], 'Detail Post')
        self.assertEqual(data['city'], 'Minneapolis')
        self.assertEqual(data['author'], 'blogger')
 
    def test_blog_post_detail_anonymous(self):
        post = self._create_post(is_anonymous=True)
        res = self.client.get(f'/api/posts/{post.id}/')
        data = res.json()['post']
        self.assertEqual(data['author'], 'Anonymous')
 
    def test_blog_post_detail_not_found(self):
        res = self.client.get('/api/posts/9999/')
        self.assertEqual(res.status_code, 404)
 
    def test_blog_post_detail_unpublished_not_found(self):
        post = self._create_post(is_published=False)
        res = self.client.get(f'/api/posts/{post.id}/')
        self.assertEqual(res.status_code, 404)
 
    # --- Delete ---
 
    def test_delete_own_blog_post(self):
        post = self._create_post()
        res = self.client.delete(f'/api/posts/{post.id}/delete/',
                                 HTTP_AUTHORIZATION=self.auth_header)
        self.assertEqual(res.status_code, 200)
        self.assertFalse(BlogPost.objects.filter(id=post.id).exists())
 
    def test_delete_other_users_blog_post(self):
        other_user = CustomUser.objects.create_user(
            email='other@test.com', username='other', password='pass123',
            first_name='Other', last_name='User',
        )
        post = self._create_post(author=other_user)
        res = self.client.delete(f'/api/posts/{post.id}/delete/',
                                 HTTP_AUTHORIZATION=self.auth_header)
        self.assertEqual(res.status_code, 403)
 
    def test_delete_nonexistent_blog_post(self):
        res = self.client.delete('/api/posts/9999/delete/',
                                 HTTP_AUTHORIZATION=self.auth_header)
        self.assertEqual(res.status_code, 404)
 
 
class CommentTests(TestCase):
    """Tests for adding and deleting comments"""
 
    def setUp(self):
        self.client = Client()
        self.user = CustomUser.objects.create_user(
            email='commenter@test.com',
            username='commenter',
            password='testpass123',
            first_name='Jane',
            last_name='Doe',
            role=CustomUser.MEMBER,
        )
        self.token = AuthToken.objects.create(user=self.user)
        self.auth_header = f'Bearer {self.token.key}'
        self.post = BlogPost.objects.create(
            author=self.user,
            title='Commentable Post',
            content='<p>Content</p>',
            is_published=True,
            allow_comments=True,
        )
 
    def test_add_comment(self):
        res = self.client.post(f'/api/posts/{self.post.id}/comments/', json.dumps({
            'content': 'Great post!',
        }), content_type='application/json',
            HTTP_AUTHORIZATION=self.auth_header)
        self.assertEqual(res.status_code, 200)
        self.assertEqual(Comment.objects.count(), 1)
        self.assertEqual(Comment.objects.first().content, 'Great post!')
 
    def test_add_comment_disabled(self):
        self.post.allow_comments = False
        self.post.save()
        res = self.client.post(f'/api/posts/{self.post.id}/comments/', json.dumps({
            'content': 'Should fail',
        }), content_type='application/json',
            HTTP_AUTHORIZATION=self.auth_header)
        self.assertEqual(res.status_code, 403)
 
    def test_add_comment_banned_user(self):
        self.user.is_banned = True
        self.user.save()
        res = self.client.post(f'/api/posts/{self.post.id}/comments/', json.dumps({
            'content': 'Banned user comment',
        }), content_type='application/json',
            HTTP_AUTHORIZATION=self.auth_header)
        self.assertEqual(res.status_code, 403)
 
    def test_delete_own_comment(self):
        comment = Comment.objects.create(
            post=self.post, author=self.user, content='To delete'
        )
        res = self.client.delete(f'/api/comments/{comment.id}/',
                                 HTTP_AUTHORIZATION=self.auth_header)
        self.assertEqual(res.status_code, 200)
        self.assertFalse(Comment.objects.filter(id=comment.id).exists())
 
    def test_delete_other_users_comment(self):
        other_user = CustomUser.objects.create_user(
            email='other@test.com', username='other', password='pass123',
            first_name='Other', last_name='User',
        )
        comment = Comment.objects.create(
            post=self.post, author=other_user, content='Not yours'
        )
        res = self.client.delete(f'/api/comments/{comment.id}/',
                                 HTTP_AUTHORIZATION=self.auth_header)
        self.assertEqual(res.status_code, 403)
 
    def test_comments_show_in_post_detail(self):
        Comment.objects.create(
            post=self.post, author=self.user, content='First comment'
        )
        Comment.objects.create(
            post=self.post, author=self.user, content='Second comment'
        )
        res = self.client.get(f'/api/posts/{self.post.id}/')
        comments = res.json()['post']['comments']
        self.assertEqual(len(comments), 2)