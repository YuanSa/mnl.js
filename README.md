# mnl.js

**JS 仿生函数命名法**

**Mock Natural Language JS Function**

使用近似自然语言的语法编写函数名。

Using natural way to write JavaScript functions' name.

## 语法 Grammar

可以在函数名内部添加括号，如下：

You can use parentheses inside the function's name, like this:

```js
function deleteThe(i)ItemFrom(arr) {
  return arr.splice(i, 1)
}
```

同样的，一个括号内可以使用多个参数。

Similarly, you can put multiple paras into one parentheses.

```js
function the(mode)ValueBetween(a,b) {
  if (mode === 'larger') {
    return a > b ? a : b;
  } else if (mode === 'smaller') {
    return a > b ? b : a;
  }
}
```

## Bugs

1. 函数调用、声明样的字符串也会被编译；
2. 参数括号内不能嵌套括号。

## 实现 How to

将函数名内部的括号`(para)`替换为`__x__`，参数列表依次添加到末尾。

Replace parenthesis in functions' name `(para)` with `__x__`, then add the paras behined one by one.

**仿生写法 MNL Style**

```js

let myHeart = ['kind', 'evil', 'happy'];

remove('evil')from(myHeart);

console.log(myHeart);

function remove(item)from(array) {
    array.splice(array.indexOf(item), 1);
    console.log(`Now I removed the ${item} in it.`);
}
```

**编译写法 Comiled Style**

```js

let myHeart = ['kind', 'evil', 'happy'];

remove__x__from('evil',myHeart);

console.log(myHeart);

function remove__x__from(item,array) {
    array.splice(array.indexOf(array.indexOf(item), 1);
    console.log(`Now I removed the ${item} in it.`);
}
```

## 命名规则 Naming Convention

建议使用 camelCase 或 under_score_case。使用 camelCase 是为了兼容，使用 under_score_case 是为了让参数与函数名划分更清晰。

It's recommanded to use camelCase or under_score_case to name a var. Using camelCase is for compatible, while under_score_case is for clearer devision between paras and function name.
