<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<aside class="sidenav" id="sidenav">
<nav class="lnb">
<ul class="nav-container">
<c:set var="frontLevel" value="0" />
<c:forEach var="menu" items="${menuList}" varStatus="status">

    
<c:if test='${menuId eq menu.menuId}'>
<c:set var="menuNm" value="${menu.menuNm}" />
<c:set var="navigation1" value="${menu.menuPath1}" />
<c:set var="navigation2" value="${menu.menuPath2}" />
<c:set var="menuL" value="${menu.menuL}" />
</c:if>


    <c:choose>
     <c:when test='${"1" eq menu.menuL}'>
      <c:if test="${'3' eq frontLevel}">  <%-- �댁쟾 硫붾돱媛 Leve3�� 寃쎌슦 ul,li �リ린 --%>
        </ul>
       </li>
      </c:if>
      <c:if test="${status.index > 0}"> 
        </ul>
      </li>
      </c:if> <%-- �댁쟾 Level1 ul �リ린 --%>
     
     <li class="nav-item <c:if test='${menuId.substring(0,2) eq menu.menuId.substring(0,2) }'>open</c:if>">
      <span><i class="ion"></i>${menu.menuNm }</span>
      <ul class="subnav">
     </c:when>
     <c:when test='${"2" eq menu.menuL}'>
      <c:choose>
       <c:when test='${"3" eq frontLevel}'> <%-- �댁쟾 硫붾돱媛 Leve3�� 寃쎌슦 ul,li �リ린 --%>
         </li></ul>
        </li>
       </c:when>
      </c:choose>
      
      <c:choose>
       <c:when test='${"0" eq menu.leafYn}'>
         <li class="<c:if test='${menuId.substring(0,3) eq menu.menuId.substring(0,3) }'>open</c:if>">
         <u>${menu.menuNm }</u>
         <ul class="subnav">
       </c:when>
       <c:otherwise>
        <li><a href="${menu.pgmPath}" class="<c:if test='${menuId eq menu.menuId }'>sn active</c:if>">${menu.menuNm }</a></li>
       </c:otherwise>
      </c:choose>
     </c:when>
     <c:otherwise>
        <li><a href="${menu.pgmPath}" class="<c:if test='${menuId eq menu.menuId }'>sn active</c:if>">${menu.menuNm }</a></li>
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
   </li>
  </c:if>
  </ul>
 </nav>
</aside>
