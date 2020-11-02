export class Slider {
  constructor() {
    /**
     * Catalog book and page properties
     */
    this.Identity;
    this.myBook;
    this.myDiv;
    this.p1;
    this.p2;
    this.p3;
    this.p4;

    /**
     * Catalog configs
     */
    this.startingPage = 0;
    this.isMoving = false;
    this.nextPage = 0;
    this.counter = 0;
    this.allowPageClick = true;
    this.allowNavigation = true;
    this.allowAutoflipFromUrl = false;
    this.pageNumberPrefix = 'page ';
    this.numPixels = 20;
    this.pSpeed = 15;

    /**
     * Book styles
     */
    this.pageBorderColor = '#000000';
    this.pageBorderStyle = 'solid';
    this.pageBorderWidth = '0';
    this.pageBackgroundColor = '#cccccc';
    this.pageFrontColor = '#ffffff';
    this.pWidth = document.getElementById('catalog_content').offsetWidth / 2;
    this.pHeight = 745;
    this.pageShadow = 0;
    this.pageShadowWidth = 80;
    this.pageShadowOpacity = 60;
    this.pBorders;
    this.pageShadowLeftImgUrl = 'black_gradient.png';

    this.pages = new Array;

    this.init = this.init.bind(this);
    this.rotateDivs = this.rotateDivs.bind(this);
    this.clipmeR = this.clipmeR.bind(this);
    this.goleft = this.goleft.bind(this);
    window.goleft = this.goleft.bind(this);
    this.clipmeR = this.clipmeR.bind(this);
    this.goright = this.goright.bind(this);
    window.goright = this.goright.bind(this);
    this.autoFlip = this.autoFlip.bind(this);
    this.createList = this.createList.bind(this);
    this.whichElement = this.whichElement.bind(this);
    this.number_check = this.number_check.bind(this);
    this.autoflipFromUrl = this.autoflipFromUrl.bind(this);

    this.init();

    this.clipLeft = document.getElementById('flipleft');
    this.clipRight = document.getElementById('flipright');

    if(this.clipLeft) {
      this.clipLeft.addEventListener('click', () => {
        this.clipmeR();
      });
    }
    if(this.clipRight) {
      this.clipRight.addEventListener('click', () => {
        this.clipmeL();
      });
    }
  }

  init() {
    this.pBorders = parseInt(this.pageBorderWidth) * 2;
    const pagesDiv = document.getElementById('flippages');
    let j = 0;
    for (let i = 0; i < pagesDiv.childNodes.length; i++) {
      if (pagesDiv.childNodes[i].nodeType == 1) {
        let newElement = pagesDiv.childNodes[i].cloneNode(true);
        newElement.style.width = this.pWidth + 'px';
        newElement.style.height = this.pHeight + 'px';

        document.getElementById('bookflip').appendChild(newElement);

        if (this.pageShadow) {
          this.createShadow(newElement, j);
        }
        if (j > 0) {
          this.createList(newElement, j);
        }
        this.pages[j] = document.getElementById('bookflip').innerHTML;
        document.getElementById('bookflip').removeChild(newElement);
        j++;
      }
    }

    this.myBook = document.getElementById('bookflip');

    if (this.myBook) {
      this.myBook.style.width = ((this.pWidth * 2) + (this.pBorders * 2)) + 'px';
      this.myBook.style.height = (this.pHeight + this.pBorders) + 'px';
      this.myBook.style.position = 'relative';
      this.myBook.style.zIndex = '0';
      this.myBook.style.overflow = 'hidden';

      for (let i = 4; i >= 1; i--) {
        this.myDiv = document.createElement('div');
        this.myDiv.style.position = 'absolute';
        this.myDiv.style.left = (this.pWidth + this.pBorders) + 'px';
        this.myDiv.style.top = '0px';
        this.myDiv.style.width = (this.pWidth) + 'px';

        this.myDiv.style.height = (this.pHeight) + 'px';
        this.myDiv.style.margin = '0px';
        this.myDiv.style.overflow = 'hidden';
        this.myDiv.style.backgroundColor = this.pageBackgroundColor;
        this.myDiv.style.color = this.pageFontColor;

        this.myDiv.style.borderWidth = this.pageBorderWidth + 'px';
        this.myDiv.style.borderColor = this.pageBorderColor;
        this.myDiv.style.borderStyle = this.pageBorderStyle;

        this.myDiv.setAttribute('id', 'p' + i);

        this.myBook.appendChild(this.myDiv);
        document.getElementById('p' + i).innerHTML = this.pages[i - 1];

        //turn page by direct click
        if (this.allowPageClick) {
          if (this.number_check(i)) {
            this.myDiv.onclick = (e) => {
              this.whichElement(e, true);
            };
          } else {
            this.myDiv.onclick = (e) => {
              this.whichElement(e, false);
            };
          }
        }
      }

      this.p1 = document.getElementById('p1');
      this.p2 = document.getElementById('p2');
      this.p1.style.left = 0 + 'px';
      let startingPageUrl = 0;

      if (this.allowAutoflipFromUrl) {
        startingPageUrl = this.autoflipFromUrl();
      }
      if (startingPageUrl) {
        this.startingPage = startingPageUrl;
      }
      if (this.startingPage == 'e') {
        this.startingPage = this.pages.length - 2;
      }
      this.startingPage = parseInt(this.startingPage);
      if (this.startingPage > 0) {
        this.autoFlip(this.startingPage);
      }
    }
  }

  rotateDivs() {
    if (this.counter > 0) {
      this.p1 = document.getElementById('p1');
      this.p2 = document.getElementById('p2');
      this.p3 = document.getElementById('p3');
      this.p4 = document.getElementById('p4');
      this.counter = 0;
    } else {
      this.p1 = document.getElementById('p3');
      this.p2 = document.getElementById('p4');
      this.p3 = document.getElementById('p1');
      this.p4 = document.getElementById('p2');
      this.counter = 1;
    }
  }

  clipmeR() {
    if (this.isMoving || this.nextPage < 2) {
      return;
    }
    this.isMoving = true;

    this.rotateDivs();

    this.p1.innerHTML = this.pages[this.nextPage - 2];
    this.p2.innerHTML = this.pages[this.nextPage - 1];

    this.nextPage = this.nextPage - 2;
    this.p1.style.clip = 'rect(0px,' + 0 + 'px,' + (this.pHeight + this.pBorders) + 'px,' + 0 + 'px)'; // rect(top,right,bottom,left)
    this.p1.style.zIndex = 3;
    this.p3.style.zIndex = 1;
    this.p2.style.clip = 'rect(0px,' + 0 + 'px,' + (this.pHeight + this.pBorders) + 'px,' + 0 + 'px)'; // rect(top,right,bottom,left)
    this.p2.style.zIndex = 4;
    this.p4.style.zIndex = 2;

    let selectIndex = this.nextPage - 1;
    if (selectIndex < 0) {
      selectIndex = 0;
    }
    if (this.allowNavigation && document.getElementById('flipSelect')) {
      document.getElementById('flipSelect').selectedIndex = selectIndex;
    }

    this.goleft(-this.pWidth, this.pWidth);
  }

  goleft(currentLeft, currentWidth) {
    if (currentLeft >= (this.pWidth - (this.numPixels * 2))) {
      window.clearTimeout(this.Identity);
      this.p2.style.left = (this.pWidth + this.pBorders) + 'px';
      this.p1.style.clip = this.p2.style.clip = 'rect(0px,' + (this.pWidth + this.pBorders) + 'px,' + (this.pHeight + this.pBorders) + 'px,' + 0 + 'px)'; // rect(top,right,bottom,left)
      this.isMoving = false;
      return;
    }
    currentLeft = currentLeft + (this.numPixels * 2);
    currentWidth = currentWidth - this.numPixels;
    let hideWidth = this.pWidth - currentWidth;
    this.p1.style.clip = 'rect(0px,' + hideWidth + 'px,' + (this.pHeight + this.pBorders) + 'px,' + 0 + 'px)'; // rect(top,right,bottom,left) // low to high

    this.p2.style.clip = 'rect(0px,' + (this.pWidth + this.pBorders) + 'px,' + (this.pHeight + this.pBorders) + 'px,' + currentWidth + 'px)'; // rect(top,right,bottom,left)
    this.p2.style.left = currentLeft + 'px';

    this.Identity = window.setTimeout('goleft(' + currentLeft + ',' + currentWidth + ')', this.pSpeed);
  }

  clipmeL() {
    if (this.isMoving || (this.nextPage + 4) > this.pages.length) {
      return;
    }
    this.isMoving = true;
    this.rotateDivs();
    // this.p1.style.borderColor = this.pageBorderColor; // reset left cover border color
    this.p1.innerHTML = this.pages[this.nextPage + 2];
    this.p2.innerHTML = this.pages[this.nextPage + 3];
    this.nextPage = this.nextPage + 2;

    this.p1.style.clip = 'rect(0px,' + 0 + 'px,' + (this.pHeight + this.pBorders) + 'px,' + 0 + 'px)'; // rect(top,right,bottom,left) clip
    this.p1.style.zIndex = 5;
    this.p2.style.clip = 'rect(0px,' + 0 + 'px,' + (this.pHeight + this.pBorders) + 'px,' + 0 + 'px)'; // rect(top,right,bottom,left) clip

    this.p2.style.zIndex = 4;
    this.p3.style.zIndex = 2;
    this.p4.style.zIndex = 1;

    let selectIndex = this.nextPage - 1;
    if (selectIndex < 0) { selectIndex = 0; }
    if (this.allowNavigation && document.getElementById('flipSelect')) {
      document.getElementById('flipSelect').selectedIndex = selectIndex;
    }

    this.goright(this.pWidth * 2, 0);
  }

  goright(currentLeft, currentWidth) {
    if (currentLeft <= this.numPixels * 2) {

      window.clearTimeout(this.Identity);
      this.p1.style.clip = this.p2.style.clip = 'rect(0px,' + (this.pWidth + this.pBorders) + 'px,' + (this.pHeight + this.pBorders) + 'px,' + 0 + 'px)'; // rect(top,right,bottom,left)
      this.p1.style.left = 0 + 'px';
      this.p2.style.left = (this.pWidth + this.pBorders) + 'px';

      this.isMoving = false;
      return;
    }
    currentLeft = currentLeft - (this.numPixels * 2);//2 * width reveal
    currentWidth = currentWidth + this.numPixels;
    let hideWidth = currentLeft - this.pWidth;

    this.p1.style.clip = 'rect(0px,' + currentWidth + 'px,' + (this.pHeight + this.pBorders) + 'px,' + 0 + 'px)'; // rect(top,right,bottom,left) clip
    this.p1.style.left = currentLeft + 'px';

    this.p2.style.clip = 'rect(0px,' + (this.pWidth + this.pBorders) + 'px,' + (this.pHeight + this.pBorders) + 'px,' + hideWidth + 'px)'; // rect(top,right,bottom,left)
    this.Identity = window.setTimeout('goright(' + currentLeft + ',' + currentWidth + ')', this.pSpeed);
  }

  autoFlip(pgNumber) {
    pgNumber = parseInt(pgNumber);
    let chcknextPage = this.nextPage;

    if (!this.number_check(pgNumber)) {
      this.nextPage = pgNumber - 1;
    } else {
      this.nextPage = pgNumber - 2;
    }
    if (pgNumber > chcknextPage) {
      this.clipmeL();
    } else {
      this.nextPage = this.nextPage + 4;
      this.clipmeR();
    }
  }
  //-->worker functions
  createList(dv, num) {
    if (this.allowNavigation && document.getElementById('flipSelect')) {
      num = num - 1;
      let y = document.createElement('option');
      if (num == 0) {
        if (dv.getAttribute('name')) {
          y.text = dv.getAttribute('name');
        } else {
          y.text = 'Cover ';
        }
      } else {
        if (dv.getAttribute('name')) {
          y.text = dv.getAttribute('name');
        } else {
          y.text = this.pageNumberPrefix + num;
        }
      }
      y.value = num;
      // y.selected = 'selected';
      let x = document.getElementById('flipSelect');
      x.style.display = '';
      x.onchange = (e) => {
        e.target.blur();
        document.body.focus();
        this.autoFlip(this.value);
      };
      try {
        x.add(y, null); // standards compliant
      } catch (ex) {
        x.add(y); // IE only
      }
    }
  }

  createShadow(dv, pg) {
    if (pg < 1) { return; } // no shadow page 0
    if (this.number_check(pg)) {

      let myPngDiv = document.createElement('div');
      myPngDiv.style.position = 'absolute';
      myPngDiv.style.top = '0px';
      myPngDiv.style.left = (this.pWidth - this.pageShadowWidth) + 'px';

      myPngDiv.style.width = (this.pageShadowWidth) + 'px';
      myPngDiv.style.height = this.pHeight + 'px';
      myPngDiv.style.backgroundColor = '#000000';

      const ie6 = (/MSIE ((5\.5)|6)/.test(navigator.userAgent) && navigator.platform == 'Win32');

      if (ie6) {
        myPngDiv.style.filter = 'progid:DXImageTransform.Microsoft.Alpha(Opacity=' + this.pageShadowOpacity + ', FinishOpacity=0, Style=1, StartX=' + this.pageShadowWidth + ', FinishX=0, StartY=0, FinishY=0)';
      } else {
        myPngDiv.style.background = 'transparent url(' + this.pageShadowLeftImgUrl + ') top right repeat-y';
      }
      dv.appendChild(myPngDiv);
    }
  }

  whichElement(e, dir) {
    let targ;
    if (!e) {
      e = window.event;
    }

    if (e.target) {
      targ = e.target;
    } else if (e.srcElement) {
      targ = e.srcElement;
    }

    if (targ.nodeType == 3) {
      targ.targ.parentNode;
    }

    // let tname;
    let pname = targ.parentNode.tagName;
    let tname = targ.tagName;
    if (tname == 'A' || tname == 'INPUT' || pname == 'A' || pname == 'INPUT') {
      return false;
    } else {
      if (dir) {
        this.clipmeL();
      } else {
        this.clipmeR();
      }
    }
  }

  number_check(value) {
    return (1 - (value % 2));
  }

  autoflipFromUrl() {
    let searchStr = window.location.search;
    let searchArray = searchStr.substring(1, searchStr.length).split('&');
    let result = '';
    for (let i = 0; i < searchArray.length; i++) {
      result = searchArray[i].split('=');
      if (result[0] == 'autoflip') {
        result = result[1];
        break;
      }
    }
    return (result);
  }
}
