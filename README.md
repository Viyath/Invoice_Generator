# Invoice_Generator

Simple app for automating your invoices

```
app.js
database structure
users{id, name, email, password}
site{s_name, address}
employer{E_name, email,
user_site{US_ID, U_ID, S_name}
user_employer{UE_ID, U_ID, E_name}
shift{S_ID, S_time, E_time, H_worked, day}
site_shift{SS_ID, S_name, S_ID, H_rate, id}
user_shift{US_ID, id, S_ID}
```

## Prerequisite

* Node.js
* MySQL

## How to start a service

1. Create DB (Only for the first time)

    ```sql
    > CREATE DATABASE my_invoice;
    > \quit
    ```
    
1. Install dependencies

    ```sh
    $ npm install
    ```

1. Start a service

    ```sh
    $ node app
    ```

1. Then open the page in the browser: http://localhost:8080
