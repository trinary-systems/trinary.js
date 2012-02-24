/*
 * Trinary core library
 *
 * Copyright 2008-2012 trinary.ru
 *
 */
trinary.core = {

    dictionary : {
        nonaryToTrinary : {
            '4' : '++',
            '3' : '+0',
            '2' : '+-',
            '1' : '0+',
            '0' : '00',
            'z' : '0-',
            'y' : '-+',
            'x' : '-0',
            'w' : '--',
            'ц' : '0-',
            'у' : '-+',
            'х' : '-0',
            'ж' : '--',
            'ч' : '++',
            'з' : '+0'
        },

        trinaryToNonary : {
            'lat' : {
                '++' : '4',
                '+0' : '3',
                '+-' : '2',
                '0+' : '1',
                '00' : '0',
                '0-' : 'z',
                '-+' : 'y',
                '-0' : 'x',
                '--' : 'w'
            },
            'rus' : {
                '++' : '4',
                '+0' : '3',
                '+-' : '2',
                '0+' : '1',
                '00' : '0',
                '0-' : 'ц',
                '-+' : 'у',
                '-0' : 'х',
                '--' : 'ж'
            }
        }
    },

    cache : {
        trinaryToNonary : {},
        sum : {},
        multiplication : {},
        tritSum : {},
        align : {}
    },

    /// Знак числа
    sign : function(tryte) {
        var sign = '';
        if (typeof tryte == 'string' && tryte.length > 0) {
			var choped = trinary.core.chop(tryte);
            sign = choped.charAt(0);
		};
        return sign;
    },

	/// Если каждая позиция не равна {0, -, +} преобразуется в 0
	validate : function(str, replace) {
		if (typeof(replace) == 'undefined') { replace = '0'; };
		return str.replace(/[^+0-]/g, replace);
	},

    /// Определение четности: "+" - четное; "0" - ноль; "-" - нечетное;
    parity : function (tryte) {
        var l = tryte.replace(/0/g, '').length;
        return (l == 0) ? '0' : ((l % 2 == 0) ? '+' : '-');
    },

    /// Добавление нулей справа до требуемой длины
    grow : function (value, length) {
        if (typeof value == 'undefined') { value = ''; };
        if (typeof length == 'undefined') { length = 9; };

        var div = length - value.length;
        if (div > 0) {
            value += trinary.core.align('0', div);
        };
        return value;
    },

    /// 10 -> 3
    decimalToTrinary : function (number) {
        if (isNaN(number) || number == 0) {
            return "0";
        } else {
            number = parseInt(number);
        };
        var deviser = number;
        var signed = 0;
        var tryte = '';
        var remainder = '';
        if (deviser<0) {
            deviser = Math.abs(deviser);
            signed = 1;
        };
        /// true -> normal expression
        while (true) {
            remainder = deviser % 3;
            deviser = Math.floor(deviser/3);
            if (remainder == 2) {
                tryte = '-' + tryte;
                deviser += 1;
            } else if (remainder == 1) {
                tryte = '+' + tryte;
            } else {
                tryte = '0' + tryte;
            };
            if (deviser<3) {
                if (deviser == 2) {
                    tryte = '+-' + tryte;
                } else if (deviser == 1) {
                    tryte = '+' + tryte;
                } else {
                    tryte = '0' + tryte;
                };
                break;
            };
        };
        if (signed) tryte = trinary.core.inverse(tryte);
        if (tryte.charAt(0) == '0') tryte = tryte.substr(1);
        return tryte;
    },

    /// 3 -> 10
    trinaryToDecimal : function(tryte) {
        var number = k = 0;
        var p = tryte.length-1;
        k = {'+': 1, '0': 0, '-': -1};
        for (i = 0; i<tryte.length; i++) {
            number += k[tryte.charAt(i)] * Math.pow(3, p);
            p--;
        };
        return number;
    },

	/// Изменение порядка следования разрядов: старшие становятся младшими, младшие - старшими
	reverse : function(tryte) {
		var result = '';
		for (var i=0; i<tryte.length; i++) {
			result = tryte.charAt(i) + result;
		};
		return result;
	},

    /// Изменение знака
    inverse : function(tryte) {
        return tryte.replace(/\+/g, '1').replace(/-/g, '+').replace(/1/g, '-');
    },

    /// Выравнивание по правому краю на заданую ширину
    align : function (str, num) {
		var idx = str.length + '+' + num;
        if (typeof trinary.core.cache.align[idx] != "undefined") {
            return trinary.core.cache.align[idx] + str;
        };

        if (/[+-]/.test(num)) { num = trinary.core.trinaryToDecimal(num); };
		var l = num - str.length;
		if (l > 0) {
			var z = '';
            while (l) {
                z += '0';
				l--;
			};
            trinary.core.cache.align[idx] = z;
            str = z + str;
		};
		return str;
	},

    /// Сумма тритов (3 трита и перенос), возвращает массив 0=>перенос, 1=>сумма
    tritSum : function (a, b, c, d) {
        if (typeof a == 'undefined') { a = '0'; };
        if (typeof b == 'undefined') { b = '0'; };
        if (typeof c == 'undefined') { c = '0'; };
        if (typeof d == 'undefined') { d = '0'; };

        var idx = a + '+' + b + '+' + c + '+' + d;
        if (typeof trinary.core.cache.tritSum[idx] != "undefined") {
            return trinary.core.cache.tritSum[idx];
        };

        var value = {'+' :1, '0':0, '-':-1};
        var sume = {4:'+', 3:'0', 2:'-', 1:'+', '0':'0', '-1':'-', '-2':'+', '-3':'0', '-4':'-'};
        var carry = {4:'+', 3:'+', 2:'+', 1:'0', '0':'0', '-1':'0', '-2':'-', '-3':'-', '-4':'-'};
        var sum = parseInt(value[a]) + parseInt(value[b]) + parseInt(value[c]) + parseInt(value[d]);
        var result = {'carry':carry[sum], 'sum':sume[sum]};
        trinary.core.cache.tritSum[idx] = result;
        return result;
    },


    /// Сумма трех трайтов
    sum : function (a, b, c) {
        if (typeof a == 'undefined') { a = '0'; };
        if (typeof b == 'undefined') { b = '0'; };
        if (typeof c == 'undefined') { c = '0'; };

        var idx = a + '+' + b + '+' + c;
        if (typeof trinary.core.cache.sum[idx] != "undefined") {
            return trinary.core.cache.sum[idx];
        };

        var result = '';
        var carry = '0';

        var digits = null;
        var lenA = a.length;
        var lenB = b.length;
        var lenC = c.length;

        if (lenA > lenB) {
            digits = lenA;
        } else {
            digits = lenB;
        };
        if (digits < lenC) {
            digits = lenC;
        };

        var s1, s2, s3;
        var tritSum = {};

        while (digits) {
            s1 = s2 = s3 = '0';
            if (lenA>0) {
                s1 = a.charAt(lenA-1);
                lenA -= 1;
            };
            if (lenB>0) {
                s2 = b.charAt(lenB-1);
                lenB -= 1;
            };
            if (lenC>0) {
                s3 = c.charAt(lenC-1);
                lenC -= 1;
            };
            tritSum = trinary.core.tritSum(s1, s2, s3, carry);
            carry = tritSum.carry;
            result = tritSum.sum + result;
            digits -= 1;
        };
        if (carry != '0') result = carry + result;
        result = trinary.core.chop(result);
        trinary.core.cache.sum[idx] = result;
        return result;
    },

    /// Перевод из 9-ричной в 3-чную
    nonaryToTrinary : function (nonary) {
        nonary = nonary.toString().toLowerCase();

        var dict = trinary.core.dictionary.nonaryToTrinary;
        var key = '';
        var data = '';

        for (var i = 0; i < nonary.length; i++) {
            key = nonary.charAt(i);
            data += (typeof dict[key] == 'undefined') ? '00' : dict[key];
        };
        return data;
    },

    /// Перевод из 3-чной в 9-ричную
    trinaryToNonary : function (tryte, version) {
        if (tryte.length % 2) {
            tryte = '0' + tryte;
        };
        if (typeof version == 'undefined') {
            version = 'rus';
        };
        if (typeof trinary.core.cache.trinaryToNonary[tryte] != "undefined") {
            return trinary.core.cache.trinaryToNonary[tryte];
        };
        var dict = trinary.core.dictionary.trinaryToNonary[version];
        var data = '';
        var key = '';

        var len = tryte.length;
        var ii = 1;
        for (var i = 0; i < len; i++) {

            key += tryte.charAt(i);

            if (ii == 2) {
                data += (typeof dict[key] == 'undefined') ? '0' : dict[key];
                key = '';
                ii = 0;
            };

            ii++;
        };
        trinary.core.cache.trinaryToNonary[tryte] = data;
        return data;
    },

    ///
    detectBase : function (arg) {
        return (/[1234zyxwцухжч]/i.test(arg)) ? 9 : 3;
    },

    /// Дробная часть
	decimalFraction : function (tryte) {
		var number = 0;
        var k = 0;
        var p = -tryte.length;
        k = {'+':1, '0':0, '-':-1};
        for (var i = 0; i<tryte.length; i++) {
            number += k[tryte.charAt(i)] * Math.pow(3, p);
            p--;
        };
        return number;
	},

    /// Перемножение трайта на трит
    tryteMultiplyTrit : function (tryte, trit) {
        var result = '';
        var multi = {'++':'+', '--':'+', '-+':'-', '+-':'-'};

        if (trit == '0') {
            result = '0';
        } else {
            for (var i = 0; i<tryte.length; i++) {
                if (tryte.charAt(i) == '0') {
                    result += '0';
                } else {
                    result += multi[tryte.charAt(i) + trit];
                };
            };
        };
        return result;
    },

    /// Поразрядное пермножение трайта на трайт (поразрядное 'И')
    /// ???
    bitwiseMultiplication : function (tryte1, tryte2) {
        var result = '';
        var multi = {'++':'+', '--':'+', '-+':'-', '+-':'-'};
        var zzz = tryte1.length - tryte2.length;
        if (zzz<0) {
            tryte2 = tryte2.substr(-zzz);
        } else if (zzz>0) {
            tryte1 = tryte1.substr(zzz);
        };
        var t1, t2;
        for (var i = 0; i<tryte1.length; i++) {
            t1 = tryte1.charAt(i);
            t2 = tryte2.charAt(i);
            if (t1 == '0' || t2 == '0') {
                result += '0';
            } else {
                result += multi[t1 + t2];
            };
        };
        return result;
    },


    /// Перемножение трайтов
    multiplication : function (tryte1, tryte2) {
        var idx = tryte1 + '*' + tryte2;
        if (typeof trinary.core.cache.multiplication[idx] != "undefined") {
            return trinary.core.cache.multiplication[idx];
        };
        var result = '0';
		var zero = '';
        var i = tryte2.length;
        var trit;
        var multply;
        while (i>0) {
            trit = tryte2[i-1];
            multply = trinary.core.tryteMultiplyTrit(tryte1, trit);
			multply += zero;
			result = trinary.core.sum(result, multply);
            zero += '0';
            i-=1;
        };
		result = trinary.core.chop(result);
        trinary.core.cache.multiplication[idx] = result;
        return result;
    },


    /// Троичный сдвиг: '+' - влево; '-' - вправо
    shift : function (tryte, n) {
        if (typeof n == 'undefined') { n = '+'; };
        var result = '';
        var zzz = '';
        if (typeof n == 'string') {
            n = trinary.core.trinaryToDecimal(n);
        };
        if (n>0) {
            while (n>0) {
                zzz += '0';
                n -= 1;
            };
            result = tryte + zzz;
        } else if (n<0) {
            var l = tryte.length;
            n = Math.abs(n);
            while (n>0) {
                zzz += '0';
                n -= 1;
            };
            tryte = zzz + tryte;
            result = tryte.substr(0, l);
        } else {
            result = tryte;
        };
        result = trinary.core.chop(result);
        return result;
    },


	/// Нормализация
	normalize : function(tryte, size) {
        if (typeof size == 'undefined') { size = 18; };
        tryte = trinary.core.chop(tryte);
		//var normalize = '0' + tryte.charAt(0);
        var normalize = '0' + tryte;
        var N = tryte.length + 1 - size;
        if (N < 0) {
            normalize = trinary.core.grow(normalize, size);
            //normalize = normalize.substr(0, size);
        } else {
            normalize = trinary.core.align(normalize, size);
            normalize = normalize.substr(0, size);
        };

        N = trinary.core.decimalToTrinary(N);
		return {'normalize' : normalize, 'N' : N};
	},


	/// Удаление ведущих нулей
	chop : function (tryte) {
		tryte = tryte.replace(/^0+/, '');
		return (tryte.length == 0) ? '0' : tryte;
	}

};