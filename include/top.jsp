<%@ page contentType="text/html; charset=utf-8" pageEncoding="utf-8"%>
<header id="header" class="header">
    <h1 class="topLogo"><a href="${menuList[0].url }">BEAT 360</a></h1>
    <nav class="topNav">
<c:forEach var="menu" items="${menuList}" varStatus="status">
	<c:if test='${"1" eq menu.menuL}'>
        <a href="<c:choose><c:when test='${menu.url == null}'>#</c:when><c:otherwise>${menu.url }</c:otherwise></c:choose>" <c:if test='${menu.menuId.substring(0,1) eq menuId.substring(0,1)}'>class="active"</c:if>>${menu.menuNm}</a>
	</c:if>
</c:forEach>
        <a href="#none" class="user line"><i class="ion ion-md-contact"></i>${SessionVO.firstNm }&nbsp;${SessionVO.lastNm }</a>
        <a href="/logout.do" class="tooltip line"><i class="ion ion-md-power"></i><span class="tooltiptext">Log out</span></a>
    </nav>
</header>
  <%@ include file="/WEB-INF/jsp/include/footer.jsp" %>