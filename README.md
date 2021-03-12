# lookdown (is experimental)

 lookdown  temporarily perisist localStorage & sessionStorage. 
 Goal is to delay JSON.stringify and avoid JSON.parse. 
 
 - currently uses 'beforeunload' event but future goal is to augment it using something like BatteryAPI(now deprecated in Firefox).
 - this is not tested