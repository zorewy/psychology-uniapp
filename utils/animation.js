
   //渐变
   const fadein = function (that, param, opacity) {
      var select = wx.createAnimation({
         duration: 500,
         timingFunction: 'ease',
      });
      select.opacity(opacity).step()
      var json = '{"' + param + '":""}'
      json = JSON.parse(json);
      json[param] = select.export()
      that.setData(json)
   }
   //垂直滑动 渐入渐出
   const slideupshow = function (that, param, px, opacity) {
      var select = wx.createAnimation({
         duration: 800,
         timingFunction: 'ease',
      });
      select.translateY(px).opacity(opacity).step()
      var json = '{"' + param + '":""}'
      json = JSON.parse(json);
      json[param] = select.export()
      that.setData(json)
   }
   //平行滑动 渐入渐出
   const sliderightshow = function (that, param, px, opacity) {
      var select = wx.createAnimation({
         duration: 400,
         timingFunction: 'ease-out',
      });
      select.translateX(px).opacity(opacity).step()
      var json = '{"' + param + '":""}'
      json = JSON.parse(json);
      json[param] = select.export()
      that.setData(json)
   }
   const bezier = function (pots, amount) {
      var pot;
      var lines;
      var ret = [];
      var points;
      for (var i = 0; i <= amount; i++) {
         points = pots.slice(0);
         lines = [];
         while (pot = points.shift()) {
            if (points.length) {
               lines.push(pointLine([pot, points[0]], i / amount));
            } else if (lines.length > 1) {
               points = lines;
               lines = [];
            } else {
               break;
            }
         }
         ret.push(lines[0]);
      }

      function pointLine(points, rate) {
         var pointA, pointB, pointDistance, xDistance, yDistance, tan, radian, tmpPointDistance;
         var ret = [];
         pointA = points[0]; //点击
         pointB = points[1]; //中间
         xDistance = pointB.x - pointA.x;
         yDistance = pointB.y - pointA.y;
         pointDistance = Math.pow(Math.pow(xDistance, 2) + Math.pow(yDistance, 2), 1 / 2);
         tan = yDistance / xDistance;
         radian = Math.atan(tan);
         tmpPointDistance = pointDistance * rate;
         ret = {
            x: pointA.x + tmpPointDistance * Math.cos(radian),
            y: pointA.y + tmpPointDistance * Math.sin(radian)
         };
         return ret;
      }
      return {
         'bezier_points': ret
      };
   }

   module.exports = {
      fadein:fadein,
      slideupshow:slideupshow,
      sliderightshow:sliderightshow,
      bezier:bezier
   }


