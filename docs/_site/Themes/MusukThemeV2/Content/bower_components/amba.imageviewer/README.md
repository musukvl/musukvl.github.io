# amba.imageviewer
JS image vierwer lightbox with zooming on scroll

demo: http://aiv.musuk.info

## Install

You can install module by bower:
```bash
bower install amba.imageviewer --save
```

Include amba.imageviewer to html with dependencies:

```html
<script src="jquery.min.js"></script>
<script src="jquery.mousewheel.min.js"></script>
<script src="amba.imageviewer.js"></script>
<link href="amba.imageviewer.css" type="text/css" rel="stylesheet"/>
```

## Usage 

Html:
```html
<a href="http://aiv.musuk.info/img/ship.jpg" class="popup" data-group="1">
   <img src="http://aiv.musuk.info/img/ship_small.jpg" alt="" />
</a>
```
*data-group* - attribute with group id for gallery.
*class="popup"* - a class to find image.

JS:
```js
$('.popup').ambaImageViewer();
```
