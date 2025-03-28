//https://quilljs.com/docs/modules/toolbar
const toolbarOptions = [
 [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
 // [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
 // [{ 'font': [] }],
  
  ['bold', 'italic', 'underline', 'strike'],        // toggled buttons
 // ['blockquote', 'code-block'],
  [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme  


  [{ 'list': 'ordered'}, { 'list': 'bullet' }, { 'list': 'check' }],
  [{ 'align': [] }], 
  [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
  [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
  [{ 'direction': 'rtl' }],                         // text direction

  ['link', 'image'],


  ['clean']                                         // remove formatting button
];

// Initialize Quill editor //
  const quill = new Quill('#editor', {
      placeholder: 'Notes...',
      theme: 'snow',
     modules: {
    toolbar: toolbarOptions
  }
  });
