(function runBuilder(){
  const D=document;
  const $=id=>D.getElementById(id);
  const controls=$("dkp-fields"), preview=$("dkp-paper"), status=$("dkp-status");
  const fields={};
  const date=new Date();
  const today=[date.getFullYear(),String(date.getMonth()+1).padStart(2,"0"),String(date.getDate()).padStart(2,"0")].join("-");
  const person=p=>[[p+"name","ФИО"],[p+"address","Адрес проживания"],[p+"reg","Адрес регистрации"],[p+"series","Серия паспорта"],[p+"number","Номер паспорта"],[p+"issue","Кем выдан, дата выдачи, код подразделения"]];
  const sections=[
    ["01 · Место и дата", [["city","Город / населённый пункт"],["date","Дата договора"]]],
    ["02 · Продавец",person("s")],["03 · Покупатель",person("b")],
    ["04 · Автомобиль",[["vin","VIN"],["model","Марка, модель ТС"],["type","Наименование (тип ТС)"],["year","Год изготовления"],["engine","Модель, № двигателя"],["chassis","Шасси (рама) №"],["body","Кузов (кабина, прицеп) №"],["color","Цвет кузова"],["plate","Государственный регистрационный знак"],["epts","ЭПТС / ПТС (номер)"]]],
    ["05 · Стоимость",[["price","Цена, рубли"],["kopecks","Копейки"],["words","Сумма прописью (рубли)"],["receipt","Полученная сумма (заполнять после расчёта)"]]]
  ];
  function create(tag,txt){const e=D.createElement(tag);if(txt!==undefined)e.textContent=txt;return e}
  for(const [title,defs] of sections){
    const fs=create("fieldset");
    fs.appendChild(create("legend",title));
    const grid=create("div");grid.className="dkp-fields";
    for(const [key,label] of defs){
      const box=create("label");box.className="dkp-field";
      if(/name|address|reg|issue|city|words|receipt/.test(key))box.classList.add("wide");
      const input=create("input");input.type=key==="date"?"date":"text";input.id="dkp-"+key;input.autocomplete="off";input.spellcheck=false;
      input.maxLength=key==="vin"?17:key==="year"?4:key==="kopecks"?2:240;
      if(key==="date")input.value=today;
      if(key==="price"||key==="kopecks")input.inputMode="numeric";
      if(key==="receipt")input.placeholder="Оставьте пустым до расчёта";
      box.append(create("span",label),input);grid.appendChild(box);fields[key]=input;
    }
    fs.appendChild(grid);controls.appendChild(fs);
  }
  const val=k=>fields[k].value.trim();
  const b=(k,n=18)=>val(k)||"_".repeat(n);
  function getDate(){
    const v=val("date"),m=["января","февраля","марта","апреля","мая","июня","июля","августа","сентября","октября","ноября","декабря"];
    if(!v)return '"_____" _____________ 20___ г.';
    const a=v.split("-");return '"'+Number(a[2])+'" '+m[Number(a[1])-1]+" "+a[0]+" г.";
  }
  function party(p,role,first){
    return [
      (first?"Мы, гр. ":"и, гр. ")+b(p+"name",36),
      "проживающий(ая) по адресу "+b(p+"address",35),
      "зарегистрированный(ая) по адресу "+b(p+"reg",34),
      "Удостоверение личности: паспорт серии "+b(p+"series",4)+" № "+b(p+"number",10)+", выдан "+b(p+"issue",20),
      'именуемый(ая) в дальнейшем "'+role+'",'
    ].join("\n");
  }
  function data(){
    return [
      ["title","ДОГОВОР\nКУПЛИ-ПРОДАЖИ ТРАНСПОРТНОГО СРЕДСТВА"],
      ["table",[[getDate(),b("city",22)]]],
      ["p",party("s","Продавец",true)],["p",party("b","Покупатель",false)],
      ["p","заключили настоящий договор о нижеследующем:"],
      ["p","1. Продавец передает в собственность Покупателю, а Покупатель принимает и оплачивает автотранспортное средство:"],
      ["table",[
        ["Идент. № (VIN): "+b("vin",17),"Марка, модель ТС: "+b("model")],
        ["Наименование (тип ТС): "+b("type"),"Год изготовления ТС: "+b("year",8)],
        ["Модель, № двигателя: "+b("engine"),"Шасси (рама) №: "+b("chassis")],
        ["Кузов (кабина, прицеп) №: "+b("body"),"Цвет кузова: "+b("color")],
        ["Государственный регистрационный знак №: "+b("plate",10),"ЭПТС: "+b("epts")]
      ]],
      ["p","2. Указанное транспортное средство (номерной агрегат) оценен сторонами на сумму:\n"+b("price",25)+" руб. "+b("kopecks",2)+" коп.\n("+b("words",38)+" руб.)"],
      ["p","3. Со слов Продавца транспортное средство (номерной агрегат) никому не продан, не заложен, в споре и под запрещением (арестом) не состоит."],
      ["p","4. Право собственности на транспортное средство (номерной агрегат) переходит к Покупателю с момента подписания настоящего договора. Настоящий договор составлен в трёх экземплярах, один экземпляр для передачи в регистрационное подразделение ГАИ, второй экземпляр передан Продавцу, третий Покупателю."],
      ["sign",[["Транспортное средство получил.\n\n________________________\n(подпись покупателя)","Деньги в сумме\n"+b("receipt",25)+"\nруб. получил.\n________________________\n(подпись продавца)"]]]
    ];
  }
  function render(){
    preview.replaceChildren();
    for(const [kind,content] of data()){
      if(kind==="table"||kind==="sign"){
        const t=create("table");if(kind==="sign")t.className="doc-sign";
        for(const row of content){const tr=create("tr");for(const v of row)tr.appendChild(create("td",v));t.appendChild(tr)}
        preview.appendChild(t);
      }else{const p=create("p",content);if(kind==="title")p.className="doc-title";preview.appendChild(p)}
    }
  }
  controls.addEventListener("input",()=>{status.textContent="";render()});
  function valid(){
    if(val("price")&&!/^\d{1,12}$/.test(val("price").replace(/\s/g,""))){status.textContent="Введите цену в рублях целым числом без запятых.";fields.price.focus();return false}
    if(val("kopecks")&&!/^\d{1,2}$/.test(val("kopecks"))){status.textContent="Копейки: от 0 до 99.";fields.kopecks.focus();return false}
    if(val("vin")&&!/^[A-HJ-NPR-Z0-9]{17}$/i.test(val("vin")))return window.confirm("VIN не соответствует стандартному формату. Продолжить?");
    return true;
  }
  function escapeXML(s){return String(s).replace(/[\x00-\x08\x0b\x0c\x0e-\x1f]/g,"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}
  function paragraph(s,title){
    const t=String(s).split("\n").map(x=>'<w:t xml:space="preserve">'+escapeXML(x)+'</w:t>').join("<w:br/>");
    return '<w:p><w:pPr><w:spacing w:after="80" w:line="250" w:lineRule="auto"/>'+(title?'<w:jc w:val="center"/>':'')+'</w:pPr><w:r><w:rPr><w:rFonts w:ascii="Times New Roman" w:hAnsi="Times New Roman"/><w:sz w:val="'+(title?26:22)+'"/>'+(title?'<w:b/>':'')+'</w:rPr>'+t+'</w:r></w:p>';
  }
  function table(rows){
    let s='<w:tbl><w:tblPr><w:tblW w:w="10300" w:type="dxa"/><w:tblLayout w:type="fixed"/></w:tblPr><w:tblGrid><w:gridCol w:w="5150"/><w:gridCol w:w="5150"/></w:tblGrid>';
    for(const row of rows){s+='<w:tr><w:trPr><w:cantSplit/></w:trPr>';for(const cell of row)s+='<w:tc><w:tcPr><w:tcW w:w="5150" w:type="dxa"/></w:tcPr>'+paragraph(cell,false)+'</w:tc>';s+='</w:tr>'}
    return s+'</w:tbl>';
  }
  function files(){
    let body="";
    for(const [kind,content] of data())body+=(kind==="table"||kind==="sign")?table(content):paragraph(content,kind==="title");
    return {
      "[Content_Types].xml":'<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/word/document.xml" ContentType="application/vnd.openxmlformats-officedocument.wordprocessingml.document.main+xml"/></Types>',
      "_rels/.rels":'<?xml version="1.0" encoding="UTF-8"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="word/document.xml"/></Relationships>',
      "word/document.xml":'<?xml version="1.0" encoding="UTF-8" standalone="yes"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body>'+body+'<w:sectPr><w:pgSz w:w="11906" w:h="16838"/><w:pgMar w:top="737" w:right="803" w:bottom="737" w:left="803" w:header="360" w:footer="360" w:gutter="0"/></w:sectPr></w:body></w:document>'
    };
  }
  function zip(obj){
    const encoder=new TextEncoder(),parts=[],central=[];
    let offset=0,csize=0,count=0;
    function crc(bytes){let c=0xffffffff;for(const x of bytes){c^=x;for(let j=0;j<8;j++)c=(c>>>1)^((c&1)?0xedb88320:0)}return (c^0xffffffff)>>>0}
    for(const name of Object.keys(obj)){
      const n=encoder.encode(name),d=encoder.encode(obj[name]),c=crc(d);
      const l=new Uint8Array(30),a=new DataView(l.buffer),m=new Uint8Array(46),v=new DataView(m.buffer);
      a.setUint32(0,0x04034b50,true);a.setUint16(4,20,true);a.setUint16(6,0x800,true);a.setUint16(12,33,true);a.setUint32(14,c,true);a.setUint32(18,d.length,true);a.setUint32(22,d.length,true);a.setUint16(26,n.length,true);
      v.setUint32(0,0x02014b50,true);v.setUint16(4,20,true);v.setUint16(6,20,true);v.setUint16(8,0x800,true);v.setUint16(14,33,true);v.setUint32(16,c,true);v.setUint32(20,d.length,true);v.setUint32(24,d.length,true);v.setUint16(28,n.length,true);v.setUint32(42,offset,true);
      parts.push(l,n,d);central.push(m,n);offset+=30+n.length+d.length;csize+=46+n.length;count++;
    }
    const e=new Uint8Array(22),v=new DataView(e.buffer);v.setUint32(0,0x06054b50,true);v.setUint16(8,count,true);v.setUint16(10,count,true);v.setUint32(12,csize,true);v.setUint32(16,offset,true);
    return new Blob(parts.concat(central,[e]),{type:"application/vnd.openxmlformats-officedocument.wordprocessingml.document"});
  }
  $("dkp-word").addEventListener("click",()=>{
    if(!valid())return;
    try{const url=URL.createObjectURL(zip(files())),a=create("a");a.href=url;a.download="Договор_купли-продажи_ТС.docx";D.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),60000);status.textContent="Договор сформирован. Проверьте данные перед подписанием."}
    catch(e){status.textContent="Не удалось сформировать Word. Попробуйте другой браузер или печать."}
  });
  $("dkp-print").addEventListener("click",()=>{if(valid()){render();window.print()}});
  $("dkp-clear").addEventListener("click",()=>{if(window.confirm("Очистить все введённые данные?")){for(const k of Object.keys(fields))fields[k].value=k==="date"?today:"";render();status.textContent="Данные очищены."}});
  render();
})();