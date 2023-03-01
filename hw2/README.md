## Project written on TypeScript, Babel,

---

### Schema validation - [Zod](https://www.npmjs.com/package/zod)

---

### Pre requirements:
Copy .env.example file  
Rename to .env  
Fill necessary fileds

### To run project in development mode run command:
```bash
npm run dev
```

### To build production version run command:
```bash
npm run build:prod
```

### To run production version run commands:
```bash
npm run build:prod

npm run start
```
### To seed DB run command:
```bash
npm run seed
```
>Note: please fill .env file see .env.example file

### To clear DB run command:
```bash
npm run seed:undo
```

Please keep in mind JWT token expires after 2 minutes. You will need to login again  
To provide custom expire time add JWT_EXPIRE_TIME(in minutes) to .env

DB have admin user with credentials:
```
login: admin
password: admin
```