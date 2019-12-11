<aside class="sidenav">
 <nav class="lnb">
  <ul class="nav-container">
   
   <c:set var="frontLevel" value="0" />
   <c:forEach var="menu" items="${menuList}" varStatus="status">
    <c:choose>
     <%-- 1 Level--%>
     <c:when test='${"1" eq menu.menuL}'>
      <c:if test="${'3' eq frontLevel}">  <%-- 이전 메뉴가 Leve3인 경우 ul,li 닫기 --%>
          </ul>
         </li>
      </c:if>
      
      <c:if test="${status.index > 0}">
        </ul>
       </li> <%-- [TO-BE] 추가 --%>
      </c:if> <%-- 이전 Level1 ul 닫기 --%>
       <%-- [AS-IS]
       <li class="nav-item">
       --%>
       <li class="nav-item <c:if test='${menuId.substring(0,2) eq menu.menuId.substring(0,2) }'>open</c:if>">
        <span><i class-"ion"></i>${menu.menuNm}</span>
        <ul class="subnav">
     </c:when>
     
     <%-- 2 Level--%>
     <c:when test='${"2" eq menu.menuL}'>
      <c:choose>
       <c:when test='${"3" eq frontLevel}'> <%-- 이전 메뉴가 Leve3인 경우 ul,li 닫기 --%>
          </ul>
         </li>
       </c:when>
      </c:choose>
     
      <c:choose>
       <c:when test='${"0" eq menu.leafYn}'>
         <%-- [AS-IS]
         <li class="<c:if test='${menuId.substring(0,2) eq menu.menuId.substring(0,2) }'>open</c:if>">

         * menuId.substring(0,3) : 이 구문은 menuId 규칙에 따라서 달라질 수 있음 ... 이건 개발자에게 문의! 

           1level : 51000 , 2 level : 51100, 3 level : 51110 이라는 전제하에 substring(0,3) 이라고 한것임....
         --%>
         <li class="<c:if test='${menuId.substring(0,3) eq menu.menuId.substring(0,3)}'>open</c:if>">
          <u>${menu.menuNm}</u>
          <ul class="subnav">
       </c:when>
       <c:otherwise>
         <%-- [AS-IS]          
         <li><a href="${menu.url}?menuId=${menu.menuId}" class="sn<c:if test='${menuId eq menu.menuId }'> active</c:if>">${menu.menuNm }</span></li>

         * sn과 active 두 클래스가 쌍으로 함께 사용되어야 한다는 전제하에 "sn"을 <c:if> 안으로 이동함. 쌍으로 사용되지 않는다면 as-is 처럼 밖에 위치
         --%>
         <li><a href="${menu.url}?menuId=${menu.menuId}" class="<c:if test='${menuId eq menu.menuId }'>sn active</c:if>">${menu.menuNm}</a></li>
       </c:otherwise>
      </c:choose>
     </c:when>
     
     <%-- 3 Level--%>
     <c:otherwise>
           <%-- [AS-IS]
           <li><a href="${menu.url}?menuId=${menu.menuId}" <c:if test='${menuId eq menu.menuId }'> class="active"</c:if>>${menu.menuNm }</a></li>

           * sn과 active 두 클래스가 쌍으로 함께 사용되어야 한다는 전제하에 "sn"을 추가. 쌍으로 사용되지 않는다면 as-is 처럼 삭제
           --%>
           <li><a href="${menu.url}?menuId=${menu.menuId}" class="<c:if test='${menuId eq menu.menuId }'>sn active</c:if>">${menu.menuNm}</a></li>
     </c:otherwise>
    </c:choose>
    
    <c:set var="frontLevel" value="${menu.menuL }" />
   </c:forEach>
   
   <c:if test='${"0" ne frontLevel}'>
    <c:if test="${'3' eq frontLevel}">
          </ul>
         </li>
    </c:if>
    
        </ul>
       </li> <%--[TO-BE] 추가 --%>
   </c:if>
  </ul> <!-- // nav-container --> <%--[TO-BE] 추가 --%>
 </nav>
</aside>
