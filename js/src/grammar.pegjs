{
  let indentationStack = [0];
  
  function pushIndentation(spaces) {
    indentationStack.push(spaces.length);
  }
  
  function popIndentation() {
    if (indentationStack.length > 1) {
      indentationStack.pop();
    }
  }
  
  function checkIndentation(spaces) {
    return spaces.length === indentationStack[indentationStack.length - 1];
  }
  
  function getCurrentIndentation() {
    return indentationStack[indentationStack.length - 1];
  }
}

document = _ links:links eof { return links.flat(); }

links = fl:firstLine list:line* { popIndentation(); return [fl].concat(list || []); }

firstLine = l:element { return l; }

line = spaces:" "* &{ return checkIndentation(spaces); } l:element { return l; }

element = e:anyLink PUSH_INDENTATION l:links { 
    return { id: e.id, values: e.values, children: l }; 
  } 
  / e:anyLink { return e; }

referenceOrLink = l:multiLineAnyLink { return l; } / i:reference { return { id: i }; }

anyLink = ml:multiLineAnyLink eol { return ml; } / sl:singleLineAnyLink { return sl; }

multiLineAnyLink = multiLinePointLink / multiLineValueLink / multiLineLink

singleLineAnyLink = fl:singleLineLink eol { return fl; } 
  / pl:singleLinePointLink eol { return pl; } 
  / vl:singleLineValueLink eol { return vl; }

multiLineValueAndWhitespace = value:referenceOrLink _ { return value; }

multiLineValues = _ list:multiLineValueAndWhitespace* { return list; }

singleLineValueAndWhitespace = __ value:referenceOrLink { return value; }

singleLineValues = list:singleLineValueAndWhitespace+ { return list; }

singleLineLink = __ id:reference __ ":" v:singleLineValues { return { id: id, values: v }; }
  / __ ":" v:singleLineValues { return { id: null, values: v }; }

multiLineLink = "(" _ id:reference _ ":" v:multiLineValues _ ")" { return { id: id, values: v }; }
  / "(" _ ":" v:multiLineValues _ ")" { return { id: null, values: v }; }

singleLineValueLink = v:singleLineValues { return { values: v }; }

multiLineValueLink = "(" v:multiLineValues _ ")" { return { values: v }; }

pointLink = id:reference { return { id: id }; }

singleLinePointLink = __ l:pointLink { return l; }

multiLinePointLink = "(" _ l:pointLink _ ")" { return l; }

reference = doubleQuotedReference / singleQuotedReference / simpleReference 

simpleReference = chars:referenceSymbol+ { return chars.join(''); }

doubleQuotedReference = '"' r:[^"]+ '"' { return r.join(''); }

singleQuotedReference = "'" r:[^']+ "'" { return r.join(''); }

PUSH_INDENTATION = spaces:" "* &{ return spaces.length > getCurrentIndentation(); } { pushIndentation(spaces); }

eol = __ ([\r\n]+ / eof)

eof = !.

__ = [ \t]*

_ = whiteSpaceSymbol*

whiteSpaceSymbol = [ \t\n\r]

referenceSymbol = [^ \t\n\r(:)]