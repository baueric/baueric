var oMatrix22=Class.create({initialize:function(e,t,n){if(null==e&&(e=0),this.col1=new oVec2,this.col2=new oVec2,null!=t&&null!=n)this.col1.SetV(t),this.col2.SetV(n);else{var r=Math.cos(e),i=Math.sin(e);this.col1.x=r,this.col2.x=-i,this.col1.y=i,this.col2.y=r}},Set:function(e){var t=Math.cos(e),n=Math.sin(e);this.col1.x=t,this.col2.x=-n,this.col1.y=n,this.col2.y=t},SetVV:function(e,t){this.col1.SetV(e),this.col2.SetV(t)},Copy:function(){return new oMatrix22(0,this.col1,this.col2)},SetM:function(e){this.col1.SetV(e.col1),this.col2.SetV(e.col2)},AddM:function(e){this.col1.x+=e.col1.x,this.col1.y+=e.col1.y,this.col2.x+=e.col2.x,this.col2.y+=e.col2.y},SetIdentity:function(){this.col1.x=1,this.col2.x=0,this.col1.y=0,this.col2.y=1},SetZero:function(){this.col1.x=0,this.col2.x=0,this.col1.y=0,this.col2.y=0},Invert:function(e){var t=this.col1.x,n=this.col2.x,r=this.col1.y,i=this.col2.y,o=t*i-n*r;return o=1/o,e.col1.x=o*i,e.col2.x=-o*n,e.col1.y=-o*r,e.col2.y=o*t,e},Solve:function(e,t,n){var r=this.col1.x,i=this.col2.x,o=this.col1.y,a=this.col2.y,s=r*a-i*o;return s=1/s,e.x=s*(a*t-i*n),e.y=s*(r*n-o*t),e},Abs:function(){this.col1.Abs(),this.col2.Abs()},MultVec:function(e){e.x=this.col1.x*e.x+this.col2.x*e.y,e.y=this.col1.y*e.x+this.col2.y*e.y},col1:new oVec2,col2:new oVec2});oMatrix22.MultMM=function(e,t){var n=new oVec2(oVec2.Dot(e.col1,t.col1),oVec2.Dot(e.col2,t.col1)),r=new oVec2(oVec2.Dot(e.col1,t.col2),oVec2.Dot(e.col2,t.col2));return new oMatrix22(0,n,r)},oMatrix22.MulTMV=function(e,t){return new oVec2(oVec2.Dot(t,e.col1),oVec2.Dot(t,e.col2))};