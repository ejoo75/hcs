/*
 * jQuery UI Monthpicker
 *
 * @licensed MIT <see below>
 * @licensed GPL <see below>
 *
 * @author Luciano Costa
 * http://lucianocosta.info/jquery.mtz.monthpicker/
 *
 * Depends:
 *  jquery.ui.core.js
 */

/**
 * MIT License
 * Copyright (c) 2011, Luciano Costa
 * 
 * Permission is hereby granted, free of charge, to any person obtaining a copy 
 * of this software and associated documentation files (the "Software"), to deal 
 * in the Software without restriction, including without limitation the rights 
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell 
 * copies of the Software, and to permit persons to whom the Software is 
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 */
/**
 * GPL LIcense
 * Copyright (c) 2011, Luciano Costa
 * 
 * This program is free software: you can redistribute it and/or modify it 
 * under the terms of the GNU General Public License as published by the 
 * Free Software Foundation, either version 3 of the License, or 
 * (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful, but 
 * WITHOUT ANY WARRANTY; without even the implied warranty of MERCHANTABILITY 
 * or FITNESS FOR A PARTICULAR PURPOSE. See the GNU General Public License 
 * for more details.
 * 
 * You should have received a copy of the GNU General Public License along 
 * with this program. If not, see <http://www.gnu.org/licenses/>.
 */

;(function ($) {

    var methods = {
        init : function (options) { 
            return this.each(function () {
                var 
                    $this = $(this),
                    data = $this.data('monthpicker'),
                    year = (options && options.year) ? options.year : (new Date()).getFullYear(),
                    settings = $.extend({
                        pattern: 'yyyy-mm',
                        selectedMonth: null,
                        selectedMonthName: '',
                        selectedYear: year,
                        startYear: year - 10,
                        finalYear: year + 10,
                        monthNames: ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'],
                        buttonImage: _CONTEXT_ROOT + '/page/images/common/calendar.gif',
                        id: "monthpicker_" + (Math.random() * Math.random()).toString().replace('.', ''),
                        openOnFocus: true,
                        disabledMonths: []
                    }, options);

                settings.dateSeparator = settings.pattern.replace(/(mmm|mm|m|yyyy|yy|y)/ig,'');

                // If the plugin hasn't been initialized yet for this element
                if (!data) {

                    $(this).data('monthpicker', {
                        'target': $this,
                        'settings': settings
                    });
                    
                    // Setting Icon
                    $('<img class="ui-datepicker-trigger mtz-monthpicker" src="'+settings.buttonImage+'" alt="Calandar" title="Calandar" />').insertAfter($this);

                    if (settings.openOnFocus === true) {
                    	$('img.mtz-monthpicker', $this.parent()).on('click', function () {
                    		$this.monthpicker('show');
                		});
                    }

                    $this.monthpicker('parseInputValue', settings);

                    $this.monthpicker('mountWidget', settings);

                    $this.on('monthpicker-click-month', function (e, month, year) {
                        $this.monthpicker('setValue', settings);
                        $this.monthpicker('hide');
                    });
                    
                    $('.ui-datepicker-prev', 'div[id="'+settings.id+'"]').on('click', function () {
                    	$this.monthpicker('previousYear', settings);
                    });
                    
                    $('.ui-datepicker-next', 'div[id="'+settings.id+'"]').on('click', function () {
                    	$this.monthpicker('nextYear', settings);
                    });

                    // hide widget when user clicks elsewhere on page
                    $this.addClass("monthpicker-widgetcontainer");
                    
                    $(document).unbind("click.mtzmonthpicker").on("click.mtzmonthpicker", function (e) {
            			if (!e.target.className || e.target.className.toString().indexOf('mtz-monthpicker') < 0) {
                            $(this).monthpicker('hideAll'); 
                        }
                    });
                }
            });
        },

        show: function () {
            var widget = $('#' + this.data('monthpicker').settings.id);
            var selectData = $(this).val() != "" ? $(this).val().split('-') : "";
            
            widget.css("top", this.offset().top  + this.outerHeight());
            if ($(window).width() > (widget.width() + this.offset().left) ){
                widget.css("left", this.offset().left);
            } else {
                widget.css("left", this.offset().left - widget.width());
            }
            
            if(widget.css('display') == 'none'){
            	var yearData = selectData != "" ? selectData[0] : (new Date()).getFullYear();
            	
            	$('.mtz-monthpicker-year', widget).val(yearData);

            	if(selectData != ""){
            		var monthData = selectData[1].substring(0,1) == "0" ? selectData[1].substring(1,2) : selectData[1];
            		$('td.mtz-monthpicker-month', widget).filter('td[data-month='+ monthData +']').find('a').addClass('ui-state-active');
            	}else{
            		$('td.mtz-monthpicker-month', widget).find('a').removeClass('ui-state-active');
            	}
            	
            	widget.show();
            } else{
            	$(this).monthpicker('hideAll'); 
            }
            
        	widget.find('select').focus();
            this.trigger('monthpicker-show');
        },

        hide: function () {
            var widget = $('#' + this.data('monthpicker').settings.id);
            if (widget.is(':visible')) {
                widget.hide();
                this.trigger('monthpicker-hide');
            }
        },

        hideAll: function () {
            $(".monthpicker-widgetcontainer").each(function () {
                if (typeof($(this).data("monthpicker"))!="undefined") { 
                    $(this).monthpicker('hide'); 
                }
            });
        },

        setValue: function (settings) {
            var 
                month = settings.selectedMonth,
                year = settings.selectedYear;

            if(settings.pattern.indexOf('mmm') >= 0) {
                month = settings.selectedMonthName;
            } else if(settings.pattern.indexOf('mm') >= 0 && settings.selectedMonth < 10) {
                month = '0' + settings.selectedMonth;
            }

            if(settings.pattern.indexOf('yyyy') < 0) {
                year = year.toString().substr(2,2);
            } 

            if (settings.pattern.indexOf('y') > settings.pattern.indexOf(settings.dateSeparator)) {
                this.val(month + settings.dateSeparator + year);
            } else {
                this.val(year + settings.dateSeparator + month);
            }
            
            this.change();
        },

        disableMonths: function (months) {
            var 
                settings = this.data('monthpicker').settings,
                container = $('#' + settings.id);

            settings.disabledMonths = months;

            container.find('.mtz-monthpicker-month').each(function () {
                var m = parseInt($(this).data('month'));
                if ($.inArray(m, months) >= 0) {
                    $(this).addClass('ui-state-disabled');
                } else {
                    $(this).removeClass('ui-state-disabled');
                }
            });
        },

        mountWidget: function (settings) {
            var
                monthpicker = this,
                container = $('<div id="'+ settings.id +'" class="ui-datepicker ui-widget ui-widget-content ui-helper-clearfix ui-corner-all" />'),
                header = $('<div class="ui-datepicker-header ui-widget-header ui-helper-clearfix ui-corner-all mtz-monthpicker" />'),
                prev = $('<a class="ui-datepicker-prev ui-corner-all mtz-monthpicker" data-handler="prev" data-event="click" title="Prev.Year"><span class="ui-icon ui-icon-circle-triangle-w mtz-monthpicker">Prev.Year</span></a>'),
                next = $('<a class="ui-datepicker-next ui-corner-all mtz-monthpicker" data-handler="next" data-event="click" title="Next.Year"><span class="ui-icon ui-icon-circle-triangle-w mtz-monthpicker">Next.Year</span></a>'),
                combo = $('<select class="mtz-monthpicker mtz-monthpicker-year" />'),
                table = $('<table class="mtz-monthpicker" />'),
                tbody = $('<tbody class="mtz-monthpicker" />'),
                tr = $('<tr class="mtz-monthpicker" />'),
                td = '',
                selectedYear = settings.selectedYear,
                option = null,
                attrSelectedYear = $(this).data('selected-year'),
                attrStartYear = $(this).data('start-year'),
                attrFinalYear = $(this).data('final-year');

            if (attrSelectedYear) {
                settings.selectedYear = attrSelectedYear;
            }

            if (attrStartYear) {
                settings.startYear = attrStartYear;
            }

            if (attrFinalYear) {
                settings.finalYear = attrFinalYear;
            }

            container.css({
                position:'absolute',
                zIndex:999999,
                whiteSpace:'nowrap',
                width:'200px',
                overflow:'hidden',
                textAlign:'center',
                display:'none',
                top: monthpicker.offset().top + monthpicker.outerHeight(),
                left: monthpicker.offset().left
            });

            combo.on('change', function () { 
                var months = $(this).parent().parent().find('td[data-month]');
                months.find('a').removeClass('ui-state-active');
                if ($(this).val() == settings.selectedYear) {
                    months.filter('td[data-month='+ settings.selectedMonth +']').find('a').addClass('ui-state-active');
                }
                monthpicker.trigger('monthpicker-change-year', $(this).val());
            });

            // mount years combo
            for (var i = settings.startYear; i <= settings.finalYear; i++) {
                var option = $('<option class="mtz-monthpicker" />').attr('value', i).append(i);
                if (settings.selectedYear == i) {
                    option.attr('selected', 'selected');
                }
                combo.append(option);
            }
            
            header.append(prev);
            header.append(combo).appendTo(container);
            header.append(next);
            
            // mount months table
            for (var i=1; i<=12; i++) {
                td = $('<td class="mtz-monthpicker mtz-monthpicker-month" />').attr('data-month',i);
                td.append('<a class="ui-state-default" href="#none"></a>');
                
                if (settings.selectedMonth == i) {
					$('a', td).addClass('ui-state-active');
                }
                
                $('a', td).append(settings.monthNames[i-1]);
                
                tr.append(td).appendTo(tbody);
                if (i % 3 === 0) {
                    tr = $('<tr class="mtz-monthpicker" />'); 
                }
            }

            tbody.find('.mtz-monthpicker-month').on('click', function () {
                var m = parseInt($(this).data('month'));
                if ($.inArray(m, settings.disabledMonths) < 0 ) {
                    settings.selectedYear = $(this).closest('.ui-datepicker').find('.mtz-monthpicker-year').first().val();
                    settings.selectedMonth = $(this).data('month');
                    settings.selectedMonthName = $(this).text();
                    monthpicker.trigger('monthpicker-click-month', $(this).data('month'));
                    $(this).closest('table').find('.ui-state-active').removeClass('ui-state-active');
                    $('a', $(this)).addClass('ui-state-active');
                }
            });

            table.append(tbody).appendTo(container);

            container.appendTo('body');
        },

        destroy: function () {
            return this.each(function () {
                $(this).removeClass('monthpicker-widgetcontainer').unbind('focus').removeData('monthpicker');
            });
        },

        getDate: function () {
            var settings = this.data('monthpicker').settings;
            if (settings.selectedMonth && settings.selectedYear) {
                return new Date(settings.selectedYear, settings.selectedMonth -1);
            } else {
                return null;
            }
        },

        parseInputValue: function (settings) {
            if (this.val()) {
                if (settings.dateSeparator) {
                    var val = this.val().toString().split(settings.dateSeparator);
                    if (settings.pattern.indexOf('m') === 0) {
                        settings.selectedMonth = val[0];
                        settings.selectedYear = val[1];
                    } else {
                        settings.selectedMonth = val[1];
                        settings.selectedYear = val[0];                                
                    }
                }
            }
        },
        
        previousYear: function (settings) {
            var _year = $('.mtz-monthpicker-year', 'div[id="'+settings.id+'"]');
            _year.val(parseInt(_year.val()) - 1);
            $("table.mtz-monthpicker").find('a').removeClass('ui-state-active');
            
            /*
            var selectedYear = parseInt(_year.val());
            var startYear = selectedYear - 10;
            var finalYear = selectedYear + 10;
            
            _year.empty();
            for (var i = startYear; i <= finalYear; i++) {
                var option = $('<option class="mtz-monthpicker" />').attr('value', i).append(i);
                if (selectedYear == i) {
                    option.attr('selected', 'selected');
                }
                _year.append(option);
            }
            */
            
//            $(this).trigger('monthpicker-change-year', _year.val());
        },
        
        nextYear: function (settings) {
        	 var _year = $('.mtz-monthpicker-year', 'div[id="'+settings.id+'"]');
        	 _year.val(parseInt(_year.val()) + 1);
        	 $("table.mtz-monthpicker").find('a').removeClass('ui-state-active');
//        	 $(this).trigger('monthpicker-change-year', _year.val());
        }

    };

    $.fn.monthpicker = function (method) {
        if (methods[method]) {
            return methods[method].apply(this, Array.prototype.slice.call( arguments, 1 ));
        } else if (typeof method === 'object' || ! method) {
            return methods.init.apply(this, arguments);
        } else {
            $.error('Method ' + method + ' does not exist on jQuery.mtz.monthpicker');
        }    
    };

})(jQuery);