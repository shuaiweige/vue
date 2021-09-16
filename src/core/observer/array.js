/*
 * not type checking this file because flow doesn't play well with
 * dynamically accessing methods on Array prototype
 */

import { def } from "../util/index";

// !取出数组原型
const arrayProto = Array.prototype;

//! 备份数组原型方法 只能升级备份的数组原型 否则会修改全局数组方法
export const arrayMethods = Object.create(arrayProto);

// mutation
const methodsToPatch = [
  "push",
  "pop",
  "shift",
  "unshift",
  "splice",
  "sort",
  "reverse",
];

/**
 * Intercept mutating methods and emit events
 */
methodsToPatch.forEach(function (method) {
  // cache original method
  //! 扩展这7个方法，让他们可以做变更通知
  const original = arrayProto[method];
  def(arrayMethods, method, function mutator(...args) {
    const result = original.apply(this, args);

    //! 变更通知 this是数组
    const ob = this.__ob__;
    // !新元素插入操作
    let inserted;
    switch (method) {
      case "push":
      case "unshift":
        inserted = args;
        break;
      case "splice":
        inserted = args.slice(2);
        break;
    }
    //! 新元素仍然需要做响应式处理的
    if (inserted) ob.observeArray(inserted);
    // notify change

    // !通知更新
    ob.dep.notify();
    return result;
  });
});
