// 转换特殊字符
const mCQ = {
  '&#91;': '[',
  '&#93;': ']',
  '&amp;': '&',
};

// CQ码内部特殊字符转义
const mCQInside = {
  '&': '&amp;',
  ',': '&#44;',
  '[': '&#91;',
  ']': '&#93;',
};

// 反转mCQInside映射
const mCQInvert = Object.fromEntries(Object.entries(mCQInside).map(([key, value]) => [value, key]));

// 匹配并返回括号内的索引
function matchBracket(text: string, index: number, brackets = ['[', ']']) {
  if (text.length <= 2 || index < 0 || index >= text.length - 1) {
    return -3;
  }

  if (
    !Array.isArray(brackets) ||
    brackets.length !== 2 ||
    brackets.some(bracket => bracket.length !== 1)
  ) {
    return -5;
  }

  let stackSize = 0;
  const start = text[index];
  if (start !== brackets[0]) {
    return -1;
  }

  for (let i = index; i < text.length; i++) {
    if (brackets[0] === text[i]) {
      stackSize++;
    }
    if (brackets[1] === text[i]) {
      stackSize--;
    }
    if (stackSize === 0) {
      return i;
    }
  }

  return -2;
}

// 解析查询字符串
function qs(text: string, sep = ',', equal = '=') {
  const ret: { [key: string]: any } = {};

  text.split(sep).forEach(part => {
    const [key, value] = part.split(equal, 2);

    if (!key) return;

    ret[key] = value
      ?.replace(
        new RegExp(Object.values(mCQInside).join('|'), 'g'),
        match => mCQInvert[match] || ''
      )
      .trim();

    try {
      if (key !== 'text') {
        ret[key] = JSON.parse(ret[key]);
      }
    } catch (e) {}
  });

  return ret;
}

// 解析CQ码
function fromCqcode(text = '') {
  const elems = [];
  const items = [];
  let itemsSize = 0;

  for (const key of Object.keys(mCQ)) {
    text = text.replace(new RegExp(key, 'g'), mCQ[key as keyof typeof mCQ]);
  }

  for (let i = 0; i < text.length; i++) {
    const pos = matchBracket(text, i);

    switch (pos) {
      case -1:
        if (!items[itemsSize]) {
          items[itemsSize] = '';
        }
        items[itemsSize] += text[i]!;
        break;
      case -2:
        throw new Error(`消息 CQ 码不匹配：${text}`);
      case -3:
        if (!items[itemsSize]) {
          items[itemsSize] = '';
        }
        items[itemsSize] += text[i]!;
        break;
      case -4:
        items.push(text.substring(i));
        i = text.length;
        break;
      case -5:
        throw new Error(`错误的括号匹配：${text}`);
      default:
        if (pos > 0) {
          items.push(text.substring(i, pos + 1));
          i = pos;
          itemsSize = items.length;
        }
    }
  }

  for (const item of items) {
    const textContent = item;
    if (textContent.includes('[CQ:')) {
      const cq = item.replace('[CQ:', 'type=').slice(0, -1);
      elems.push(qs(cq));
    } else if (textContent) {
      elems.push({ type: 'text', text: textContent });
    }
  }

  return elems;
}

// 解析CQ码（Onebot版）
function fromCqcode2(text = '') {
  const elems = fromCqcode(text);
  return elems.map(CQ => {
    const { type } = CQ;
    delete CQ.type;
    return { type, data: CQ };
  });
}

// const cqw = '[CQ:text,file=123,url=456sad] 12312 [CQ:image,file=123]555555 '
// try {
//     console.log(fromCqcode2(cqw))
// } catch(err) {
//     console.log(err.message)
// }

export { fromCqcode, fromCqcode2, qs };
