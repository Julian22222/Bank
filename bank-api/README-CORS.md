# CORS

[ --> CORS <--](https://www.youtube.com/watch?v=sZGNDx_afPU&list=WL&index=500)

What is CORS?

You have a website and it has domain name or host name. Other Back-End and microservices have their own domain names or host names. This Front-End Website to interact with other BACK-END (API server) and with other microservices that have different domains needs permission.

CORS inserts in the Back-end server.

CORS it is like permission which allows to interact with the Back-End, allowing other domains and localhosts from other servers to interact with your Back-End server.

CORS - give access to servers and other microservices (in case if domains are different. They are always different). The Front-End and Back-End they have different domains, or Back-End and microservice have also different domains.

##### Schema

1. Front-End send permission to Back-End.

- Front-End sends OPTIONS" Request Method, similar to GET,POST,PUT,DELETE request methods to Back-End.

- This permission asks, can Front-End server make for example - GET request from your Back-End server.

2. Then CORS send response back via "Response Headers", it is the list of domains that can be used to access this Back-End server.

If CORS is not adjusted for different domains it will return responce saying that Front-End don't have access to this Back-End

#### If you're using Node/Express:

- Add CORS to your backend

```JS
//npm i cors <-- in terminal

import cors from "cors";
app.use(cors());

//Allow ALL domains to access the backend.
//It sets: Access-Control-Allow-Origin: *

//It is less secure tham NEST.JS where we indicate wtah domains and localhost can access our Back-End.
```

```JS
//CORS for specific domains

import cors from "cors";

app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

// Only requests from:
// ➡️ http://localhost:3000
// are allowed.

// All others will get a CORS error.
```

```JS
//Express Allow MULTIPLE specific domains

app.use(
  cors({
    origin: [
      "http://localhost:3000",
      "http://localhost:4000",
      "https://mywebsite.com",
    ],
  })
);

//You can allow as many as you want.
```

```JS
//✅ With credentials (cookies, JWT cookies, sessions)

app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

//Browser will then include cookies in requests.

//////////////////////////////////////
//✅ Allow dynamic origins
//Example: allow some domains, block others:

const allowedOrigins = [
  "http://localhost:3000",
  "https://myfrontend.com",
];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        // allow requests with no origin (mobile apps, curl, Postman)
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
  })
);

```

# CORS in NEST.JS

- CORS does NOT control where your backend runs.
- CORS controls WHO is allowed to call your backend.
- CORS just limits which websites can send requests to your NEST.JS PORT (this PORT is in main.ts)

1. Enable CORS in NestJS

To let your Next.js (port 3000) call your NestJS API (for example: port 3005), you must enable CORS in your NestJS main.ts.

- open file--> backend/src/main.ts

```JS
//Add this

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

// app.enableCors({...}) must be before app.listen(PORT)
  app.enableCors({
    origin: "http://localhost:3000", // Next.js frontend
    methods: "GET,POST,PUT,DELETE",
    credentials: true,
  });

  await app.listen(3005);
}
bootstrap();
```

```JS
//it will work with this code as well
app.enableCors({ origin: "http://localhost:3000" });
```

```JS
// ❌ A common mistake is to use this code:

app.enableCors();

//depending on how Nest is configured, this might NOT allow cross-port requests.
//So specify the origin explicitly.
```

# Explanation of NEST.JS CORS block

```JS
app.enableCors({
  origin: "http://localhost:3000",
  methods: "GET,POST,PUT,DELETE",
  credentials: true,
});

//Only Next.js dev frontend can make requests - PORT 3000 is a port from NEXT.JS (front end port)
```

- This does NOT mean your backend runs on port 3000
- Your backend still runs on port that you set in listen()
- This code only controls what frontend is allowed to call your backend.

1. origin: "http://localhost:3000"

➜ Only a website loaded from
http://localhost:3000

is allowed to make requests to this backend.

This is your Next.js frontend.

If another origin (example: http://localhost:3001) tries to call your NestJS API, the browser will block it with a CORS ERROR.

2. methods: "GET,POST,PUT,DELETE"

These are the allowed HTTP method types for cross-origin requests.

3. credentials: true

This enables cookies / sessions / authentication headers if needed.

🚨 What happens if you change localhost:3000 to something else?
✔ Example: You change to:

```JS
origin: "http://localhost:4000"
```

Now only a frontend running on:

```JS
http://localhost:4000
```

can access the backend.

Your Next.js app on port 3000 will now get a CORS ERROR again.

# Example: You want to allow multiple origins (common setup)

```JS
origin: ["http://localhost:3000", "http://localhost:3001"],

//Now both frontends can access your API.
```

### Real world example

Example: You want to allow your deployed site

```JS
//If your app is deployed, you might do:
//you include your localhost front end PORT and your domain

origin: [
  "http://localhost:3000",
  "https://mywebsite.com",
]

//This allows both local development and production.
```

# Example: You want to allow ANY frontend (not recommended for production)

```JS
origin: "*"

//⚠️ This allows all websites to talk to your backend.
//⚠️ It also disables credentials, so cookies & auth headers won't work.
//Anyone can call your backend (not safe)
```
