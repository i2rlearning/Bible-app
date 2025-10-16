// 1) Register style-based size under the formats/size key (bulletproof override)
const Size = Quill.import('attributors/style/size');
Size.whitelist = ['8px','10px','12px','14px','16px','18px','24px','32px'];
Quill.register({ 'formats/size': Size }, true);   // <-- key change

// 2) Your toolbar with numeric sizes
const toolbarOptions = [
  [{ size: Size.whitelist }],   // numeric dropdown
  // [{ 'header': [1, 2, 3, 4, 5, 6, false] }], 
  // [{ 'font': [] }],
  ['bold','italic','underline','strike'],
  [{ color: [] }, { background: [] }],
  [{ list: 'ordered' }, { list: 'bullet' }, { list: 'check' }],
  [{ align: [] }],
  [{ script: 'sub' }, { script: 'super' }],
  [{ indent: '-1' }, { indent: '+1' }],
  [{ direction: 'rtl' }],
  ['link','image'],
  ['clean']
];

// 3) Initialize AFTER the register call
const quill = new Quill('#editor', {
  placeholder: 'Notes...',
  theme: 'snow',
  modules: { toolbar: toolbarOptions }
});

// 4) Make 12px the default typing size AND reflect it in the dropdown UI
const toolbar = quill.getModule('toolbar');
const sizeSelect = toolbar?.container.querySelector('select.ql-size');

// If editor is empty, set default format for future typing
if (quill.getLength() <= 1) {
  quill.format('size', '12px');
} else {
  // If content already present, apply once across it
  quill.formatText(0, quill.getLength(), { size: '12px' });
}

// Sync the dropdown’s visible value
if (sizeSelect) {
  sizeSelect.value = '12px';
  sizeSelect.dispatchEvent(new Event('change'));
}
