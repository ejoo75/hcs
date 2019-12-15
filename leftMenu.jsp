<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<aside class="sidenav">
<nav class="lnb">
<c:set var="frontLevel" value="0" />
<c:forEach var="menu" items="${menuList}" varStatus="status">
    <c:if test='${menuId eq menu.menuId}'>
<c:set var="menuNm" value="${menu.menuNm}" />
<c:set var="navigation1" value="${menu.menuPath1}" />
<c:set var="navigation2" value="${menu.menuPath2}" />
<c:set var="menuL" value="${menu.menuL}" />
    </c:if>
    <c:if test="${menu.menuId.substring(0,1) eq menuId.substring(0,1)}">
    <c:choose>
	   <c:when test='${"1" eq menu.menuL}'>
    <h2>${menu.menuNm }</h2>
    <ul class="nav-container">
        </c:when>
        <c:when test='${"2" eq menu.menuL}'>
            <c:choose>
                <c:when test='${"2" eq frontLevel}'>
        </li>
                </c:when>
                <c:when test='${"3" eq frontLevel}'>
            </ul>
        </li>
                </c:when>
            </c:choose>
            <c:choose>
                <c:when test='${"0" eq menu.leafYn}'>
        <li class="nav-item <c:if test='${menuId.substring(0,2) eq menu.menuId.substring(0,2) }'>open</c:if>">
            <span>${menu.menuNm }</span>
            <ul class="subnav">
                </c:when>
                <c:otherwise>
        <li class="nav-item"><a href="${menu.url}?menuId=${menu.menuId}"><span class="sn<c:if test='${menuId eq menu.menuId }'> active</c:if>">${menu.menuNm }</span></a>
                </c:otherwise>
            </c:choose>
        </c:when>
        <c:otherwise>
          <li><a href="${menu.url}?menuId=${menu.menuId}" <c:if test='${menuId eq menu.menuId }'> class="active"</c:if>>${menu.menuNm }</a></li>
        </c:otherwise>
    </c:choose>
    <c:set var="frontLevel" value="${menu.menuL }" />
    </c:if>
</c:forEach>
<c:if test='${"1" ne frontLevel}'>
    </ul>
</c:if>
</nav>
</aside>
