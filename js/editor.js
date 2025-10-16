const Size = Quill.import('attributors/style/size');
Size.whitelist = ['8px','10px','12px','14px','16px','18px','24px','32px'];
Quill.register({ 'formats/size': Size }, true);

const toolbarOptions = [
  [{ size: Size.whitelist }],   // numeric dropdown
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

const quill = new Quill('#editor', {
  placeholder: 'Notes...',
  theme: 'snow',
  modules: { toolbar: toolbarOptions }
});

const toolbar = quill.getModule('toolbar');
const sizeSelect = toolbar?.container.querySelector('select.ql-size');

if (quill.getLength() <= 1) {
  quill.format('size', '14px');
} else {
  // If content already present, apply once across it
  quill.formatText(0, quill.getLength(), { size: '14px' });
}

// Sync the dropdown’s visible value
if (sizeSelect) {
  sizeSelect.value = '14px';
  sizeSelect.dispatchEvent(new Event('change'));
}
