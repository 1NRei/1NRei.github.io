// Keep an anchored section when visitors switch languages.
document.querySelectorAll('.language-switch a').forEach(link=>{
  link.addEventListener('click',()=>{
    if(location.hash)link.hash=location.hash;
  });
});
