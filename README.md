# Invoice_Generator
Simple app for automating your invoices
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

