# youtube Reloaded

## 어떤종류의 데이터를 필요한 것인가

user, video 를 나눠서 user가 하는행동 video에 대한 행동을 나눠서 라우터를 정하자.

### Global Router

/ -> Home
/join -> Join
/login -> Login
/search -> Search

-   /join이나 /login은 유저가 하는 행동이니까 users/join, users/login으로 해도 무방하다. 하지만 global에 놓는 이유는 논리상으로는 그게 맞지만 그렇게되면 너무 라우터가 길어지기때문에 예외적으로 깔끔하게 라우터를 정의하기위해서 글로벌로 넣는 경우가 있다.

### user Router

/users/:id -> See the User

/users/logout -> Log Out
/users/edit -> Edit my Profile
/users/delete -> Delete my Profile

### videos Router

/videos/:id -> Watch the Video
/videos/:id/edit -> Edit the Video
/videos/:id/delete -> Delete the Video
/videos/upload -> Upload Video

if (!router) ... /comments-on-video , /delete-a-comments-of-a-video..
명확성X
