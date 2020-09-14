# mnl.js

**仿自然语言JS函数（仿生函数命名法）**

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

## 实现 How to

将函数名内部的括号`(para)`替换为`__x__`，参数列表依次添加到末尾。

Replace parenthesis in functions' name `(para)` with `__x__`, then add the paras behined one by one.

**仿生写法 MNL Style**

```js
function deleteThe(i)ItemFrom(arr) {
  return arr.splice(i, 1)
}
```

**编译写法 Comiled Style**

```js
function deleteThe__x__ItemFrom__x__(i, arr) {
  return arr.splice(i, 1)
}
```

## 命名规则 Naming Convention

建议使用camelCase或under_score_case。使用camelCase是为了兼容，使用under_score_case是为了让参数与函数名划分更清晰。

It's recommanded to use camelCase or under_score_case to name a var. Using camelCase is for compatible, while under_score_case is for clearer devision between paras and function name.
