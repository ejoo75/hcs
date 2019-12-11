<aside class="sidenav">
<nav class="lnb">
<ul class="nav-container">
  <c:set var="frontLevel" value="0" />
  
  <c:forEach var="menu" items="${menuList}" varStatus="status">
    <c:choose>
     <c:when test='${"1" eq menu.menuL}'>
      <c:if test="${'3' eq frontLevel}">  <%-- 이전 메뉴가 Leve3인 경우 ul,li 닫기 --%>
        </ul>
       </li>
      </c:if>
      <c:if test="${status.index > 0}"> </ul> </c:if> <%-- 이전 Level1 ul 닫기 --%>
      <li class="nav-item">
       <span><i class-"ion"></i>${menu.menuNm }</span>
      <ul class="subnav">
     </c:when>
     <c:when test='${"2" eq menu.menuL}'>
      <c:choose>
       <c:when test='${"3" eq frontLevel}'> <%-- 이전 메뉴가 Leve3인 경우 ul,li 닫기 --%>
         </ul>
        </li>
       </c:when>
      </c:choose>
      
      <c:choose>
       <c:when test='${"0" eq menu.leafYn}'>
         <li class="<c:if test='${menuId.substring(0,2) eq menu.menuId.substring(0,2) }'>open</c:if>">
         <u>${menu.menuNm }</u>
         <ul class="subnav">
       </c:when>
       <c:otherwise>
        <li><a href="${menu.url}?menuId=${menu.menuId}" class="sn<c:if test='${menuId eq menu.menuId }'> active</c:if>">${menu.menuNm }</span></li>
       </c:otherwise>
      </c:choose>
     </c:when>
     <c:otherwise>
        <li><a href="${menu.url}?menuId=${menu.menuId}" <c:if test='${menuId eq menu.menuId }'> class="active"</c:if>>${menu.menuNm }</a></li>
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
  </c:if>
 </nav>
</aside>
