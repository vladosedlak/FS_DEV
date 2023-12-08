# BLOG API

## GET /users
- zoznam užívatelov - vracia defaultne page 1 s 25 uzivatelmi
### HTTP 200

```
[
    {
        id: 1,
        name: "Mark Fine"
    },
    {
        id: 2,
        name: "Derek Maine"
    },
    ...
]
```

## GET /users?page=2&perPage=25
- zoznam užívatelov - stránkovanie cez URL parametre
### HTTP 200

```
[
    {
        id: 1,
        name: "Mark Fine"
    },
    {
        id: 2,
        name: "Derek Maine"
    },
    ...
]
```

## GET /users/{id}
- Profil uzivatela

### HTTP 200

```
{
    id: 1,
    name: "Mark Fine",
    about: "lorem ipusm..."

}

```
### HTTP 404
```
{
    error: "USER_NOT_FOUND"
    message: "User {id} was not found and probably doesn´t exist."
}
```

## GET /posts?category=1,2,13&sort_by=latest&page=1&perPage=10
- Zoznam blogov
- Filter podľa kategórie (defaultne vracia všetky kategórie)
- Moznost zoradit podla:
    - datumu publikovania (latest)
    - popularity
    - odporúčané - cognitive services vracajú zoznam na základe už čítaných článkov :D
- stránkovanie

### HTTP 200

```
[
    {
    id: 434,
    name: "Blog X"
},
{
    id: 433,
    name: "Blog Y"
},
...
]
```
## GET /post/{id}
- obsah blogu / vracia všetky informácie o konkrétnom článku - blogu

### HTTP 200

```
{
    id: 434,
    name: "Blog 1"
    id_owner: 2
    content: "lorem ipsum..."
}

```
### HTTP 404
```
{
    error: "POST_NOT_FOUND"
    message: "Post {id} was not found and probably doesn´t exist."
}
```




## POST /user
- vytvorenie nového usera
{
    name: "Mark Name",
    mail: "example@mail.com",
    about: "lorem ipsum..."
}

### HTTP 200

```
{
    id: 4,
    name: "Mark Name",
    mail: "example@mail.com",
    about: "lorem ipsum..."
}

```
### HTTP 412
- validačná chyba
```
{
    error: "Validation error"
    message: "Email must contain @ symbol"
}
```

## PATCH /user/{id}
- úprava usera
{
    name: "Mark Name 2",
    mail: "example@mail.com",
    about: "lorem ipsum asdf"
}

### HTTP 200

```
{
    id: 4,
    name: "Mark Name 2",
    mail: "example@mail.com",
    about: "lorem ipsum asdf"
}

```
### HTTP 404

```
{
    error: "USER_NOT_FOUND"
    message: "User {id} does not exist"
}
```
## POST /post
- vytvorenie postu
{
    name: "Blog C",
    id_author:4,
    category: 3,
    content: "HTML RICH TEXT"
}

### HTTP 200

```
{
    id:467
    name: "Blog C",
    id_author:4,
    category: 3,
    content: "HTML RICH TEXT"
}

```
### HTTP 412
- validačná chyba
```
{
    error: "Validation error"
    message: "Content can not be empty"
}
```

## PATCH /post/{id}
- úprava blogu
{
    id:467
    name: "Blog CD",
    id_author:4,
    category: 3,
    content: "HTML RICH TEXT 2"
}

### HTTP 200

```
{
    id:467
    name: "Blog CD",
    id_author:4,
    category: 3,
    content: "HTML RICH TEXT 2"
}
```
### HTTP 404

```
{
    error: "POST_NOT_FOUND"
    message: "Blog {id} does not exist"
}
```

## DELETE /post/{id}
- vymazanie blogu


### HTTP 201


## DELETE /user/{id}
- vymazanie usera


### HTTP 201
