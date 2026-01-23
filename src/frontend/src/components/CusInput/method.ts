import { type variableType } from './varList';

export const addVariable = (row: variableType) => {
  const sel = window.getSelection() as Selection;
  if (!sel.rangeCount) {
    return; // 如果没有选区，就返回
  }

  let range = sel.getRangeAt(0);

  // 如果选区不是空的，我们可能需要处理它，但在这个例子中，我们简单地移除选区内容
  if (range.toString()) {
    range.deleteContents();
  }

  const idExtra = Date.now();
  // 创建要插入的HTML片段
  const node_prompt_variable = document.createElement('span');
  node_prompt_variable.contentEditable = 'false'; // 注意：contentEditable 是属性，不是属性名，不需要引号
  node_prompt_variable.className = 'variable-template-Text';
  node_prompt_variable.innerHTML = `<span id="variable${idExtra}" style="display: none; color: green; margin: 0 5px;">${row.tip}</span>\${ ${row.prop} }`;
  node_prompt_variable.onmouseover = () => {
    const tipDom = document.getElementById(`variable${idExtra}`);
    tipDom && (tipDom.style.display = 'inline-block');
  };
  node_prompt_variable.onmouseleave = () => {
    const tipDom = document.getElementById(`variable${idExtra}`);
    tipDom && (tipDom.style.display = 'none');
  };

  // 如果选区是空的，我们将光标位置作为插入点
  // 如果选区不是空的（但在这个例子中我们已经删除了它），则开始位置已经是我们要插入的位置

  // 创建一个新的Range，它的开始和结束点都在当前range的开始点之前
  const prevRange = range.cloneRange();
  prevRange.setStart(range.startContainer, range.startOffset - 1); // 尝试在光标前一个字符位置

  // 检查是否可以在前一个字符位置插入（例如，确保不会超出文本的开始）
  if (prevRange.startContainer.nodeType === Node.TEXT_NODE && prevRange.startOffset >= 0) {
    // 可以安全地插入
    prevRange.collapse(true); // 折叠range到开始点
    prevRange.insertNode(node_prompt_variable);

    // 更新选区以反映新插入的节点
    range = document.createRange();
    range.setStartAfter(node_prompt_variable);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  } else {
    // 如果不能在前一个字符位置插入（例如，已经处于文本的开始），则直接在开始位置插入
    range.insertNode(node_prompt_variable);

    // 更新选区以反映新插入的节点
    range = document.createRange();
    range.setStartAfter(node_prompt_variable);
    range.collapse(true);
    sel.removeAllRanges();
    sel.addRange(range);
  }
};
