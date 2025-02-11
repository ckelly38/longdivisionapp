//import logo from './logo.svg';
import './App.css';
import React, { useState } from "react";

function App() {
    let [divisor, setDivisor] = useState(1);
    let [startnum, setStartNum] = useState(0);
    let [run, setRun] = useState(false);
    let [usemoddiv, setUseModDiv] = useState(false);
    let [numdcs, setPrecision] = useState(15);
    let [showerror, setShowError] = useState(false);

    function isLetUndefined(val) { return (val === undefined); }
    function isLetUndefinedOrNull(val) { return (val === undefined || val === null); }
    function isLetEmptyNullOrUndefined(val) { return (isLetUndefinedOrNull(val) || val.length < 1); }
    function letMustBeDefinedAndNotNull(val, varnm="varnm")
    {
        if (isLetEmptyNullOrUndefined(varnm)) return letMustBeDefinedAndNotNull(val, "varnm");
        //else;//do nothing
        if (isLetUndefinedOrNull(val))
        {
            throw new Error(varnm + " must be defined and not null, but it was not!");
        }
        else return true;
    }
    function letMustNotBeEmpty(val, varnm="varnm")
    {
        if (isLetEmptyNullOrUndefined(varnm)) return letMustNotBeEmpty(val, "varnm");
        //else;//do nothing

        if (isLetEmptyNullOrUndefined(val))
        {
            throw new Error(varnm + " must be defined, not null, and not empty, but it was not!");
        }
        else return true;
    }
    function letMustBeBoolean(val, varnm="varnm")
    {
        if (isLetEmptyNullOrUndefined(varnm)) return letMustBeBoolean(val, "varnm");
        //else;//do nothing
        letMustBeDefinedAndNotNull(val, varnm);
        if (val === true || val === false) return true;
        else throw new Error(varnm + " must be a defined boolean value, but it was not!");
    }

    function isLetNotANumber(val) { return (isLetEmptyNullOrUndefined(val) || isNaN(val)); }
    function letMustBeANumber(val, varnm="varnm")
    {
        if (isLetEmptyNullOrUndefined(varnm)) return letMustBeANumber(val, "varnm");
        //else;//do nothing
        if (isLetNotANumber(val)) throw new Error(varnm + " must be a number, but it was not!");
        else return true;
    }

    //min val is inclusive and max will be included if incmax is true, by default max is included
    function isNumberInvalid(num, minval, maxval, incmax=true)
    {
        letMustBeANumber(num, "num");
        letMustBeANumber(minval, "minval");
        letMustBeANumber(maxval, "maxval");
        letMustBeBoolean(incmax, "incmax");
        const mynumisinv = (num < minval || maxval < num);
        return (incmax ? mynumisinv : (mynumisinv || maxval === num));
    }

    //max and min vals are inclusive on the valid range
    function letNumberMustBeValidOrInvalid(num, minval, maxval, usevalid, incmax, varnm="varnm")
    {
        letMustBeBoolean(usevalid);
        letMustBeBoolean(incmax);
        if (isLetEmptyNullOrUndefined(varnm))
        {
            return letNumberMustBeValidOrInvalid(num, minval, maxval, usevalid, incmax, "varnm");
        }
        //else;//do nothing

        if (isNumberInvalid(num, minval, maxval, incmax))
        {
            if (usevalid) throw new Error(varnm + " must be valid, but it was not!");
            else return true;
        }
        else
        {
            if (usevalid) return true;
            else throw new Error(varnm + " must be invalid, but it was not!");
        }
    }
    function letNumberMustBeValid(num, minval, maxval, incmax, varnm="varnm")
    {
        return letNumberMustBeValidOrInvalid(num, minval, maxval, true, incmax, varnm);
    }
    function letNumberMustBeInValid(num, minval, maxval, incmax, varnm="varnm")
    {
        return letNumberMustBeValidOrInvalid(num, minval, maxval, false, incmax, varnm);
    }

    function isDigit(mchar)
    {
        return (mchar === '0' || mchar === '1' || mchar === '2' || mchar === '3' ||
            mchar === '4' || mchar === '5' || mchar === '6' || mchar === '7' ||
            mchar === '8' || mchar === '9');
    }

    function isDecimalNumAnInteger(stra)
    {
        letMustNotBeEmpty(stra, "stra");
        const dpti = stra.indexOf(".");
        const hasnodpt = isNumberInvalid(dpti, 0, stra.length - 1);
        if (hasnodpt) return true;
        else
        {
            for (let i = dpti; i < stra.length; i++)
            {
                if (stra.charAt(i) === '.');
                else if (isDigit("" + stra.charAt(i)))
                {
                    if (stra.charAt(i) === '0');
                    else return false;
                }
                else throw new Error("invalid character on the string!");
            }
            return true;
        }
    }
    function canTruncate(stra) { return isDecimalNumAnInteger(stra); }

    function truncateIfCan(stra)
    {
        if (isDecimalNumAnInteger(stra))
        {
            const dpti = stra.indexOf(".");
            const hasnodpt = isNumberInvalid(dpti, 0, stra.length - 1);
            if (hasnodpt) return stra;
            else return stra.substring(0, dpti);
        }
        else return stra;
    }

    function removeLeadingZerosIfCan(stra)
    {
        letMustNotBeEmpty(stra, "stra");
        //a leading zero is not a - or .
        //a leading zero is a zero in front of the number
        //-0000001000000 (everything between - and 1 is a leading zero)
        //00000001000000 (everything before the 1 is a leading zero)
        //-0000000000000 (all but the last zero is a leading zero)
        //000000.0000001 (all of the zeros before the decimal point except for the one next to it)
        //IE it is everything before the first non-zero digit found before the decimal point
        //excluding the zero immediately before the decimal point

        let mynwstra = "";
        let si = 0;
        if (stra.charAt(0) === '-')
        {
            si = 1;
            mynwstra = "-";
        }
        //else;//do nothing

        for (let i = si; i < stra.length; i++)
        {
            if (stra.charAt(i) === '.')
            {
                //keep everything at and after the decimal point
                mynwstra += stra.substring(i);
                return mynwstra;
            }
            else if (isDigit("" + stra.charAt(i)))
            {
                if (stra.charAt(i) === '0')
                {
                    if (i + 1 < stra.length)
                    {
                        if (stra.charAt(i + 1) === '.') mynwstra += "0";
                        //else;//do nothing
                    }
                    else mynwstra += "0";
                }
                else
                {
                    //keep everything at and after the first non-zero digit
                    mynwstra += stra.substring(i);
                    return mynwstra;
                }
            }
            else throw new Error("illegal character found at i = " + i + "!");
        }
        return ((mynwstra === "-0") ? "0" : mynwstra);
    }
    function removeEndingZerosIfCan(stra)
    {
        letMustNotBeEmpty(stra, "stra");
        const dpti = stra.indexOf(".");
        const hasnodpt = isNumberInvalid(dpti, 0, stra.length - 1);
        if (hasnodpt) return stra;
        //else;//do nothing

        //0.00000000010000000 (everything after the 1 is an ending zero)
        //0.00000000000000000 (everything up to and including the decimal point is an ending zero)
        //but nothing after the decimal point is an ending zero (right to left)
        //ending zeros are only after the decimal point (left to right)

        for (let i = stra.length - 1; (i === 0 || 0 < i) && i < stra.length; i--)
        {
            if (stra.charAt(i) === '.')
            {
                //either way we stop here, but we might need to include this or not
                //we must keep everything before the decimal point
                //but do we keep the decimal point? no.
                if (i === 0) throw new Error("the resultant string must not be empty!");
                else return stra.substring(0, i);
            }
            else if (isDigit("" + stra.charAt(i)))
            {
                if (stra.charAt(i) === '0');
                else
                {
                    //stop here, but must include this...
                    return stra.substring(0, i + 1);
                }
            }
            else throw new Error("illegal character found at i = " + i + "!");
        }
        throw new Error("the resultant string must not be empty!");
    }
    function removeUnnecessaryZerosIfCan(stra)
    {
        return removeEndingZerosIfCan(removeLeadingZerosIfCan(stra));
    }

    function truncateAndRemoveUnnecessaryZerosIfCan(stra)
    {
        return removeUnnecessaryZerosIfCan(truncateIfCan(stra));
    }

    function getAndSetNewStartNumAndDivisorNum(snum, divnum)
    {
        console.log("snum = " + snum);
        console.log("divnum = " + divnum);
        if (truncateAndRemoveUnnecessaryZerosIfCan("" + divnum) === '0')
        {
            throw new Error("cannot divide by zero!");
        }
        let mydivnumstr = "" + divnum;
        console.log("mydivnumstr = " + mydivnumstr);
        console.log("mydivnumstr.length = " + mydivnumstr.length);

        let deptindx = mydivnumstr.indexOf(".");
        console.log("deptindx = " + deptindx);

        let nodptindiv = (deptindx < 0 || mydivnumstr.length - 1 < deptindx);
        if (nodptindiv) return {"snum": Number(snum), "divnum": Number(divnum)};
        else
        {
            //6.7
            //012
            // ^
            let tempdivstr =  mydivnumstr.substring(deptindx + 1);
            console.log("tempdivstr = " + tempdivstr);
            console.log("tempdivstr.length = " + tempdivstr.length);

            const mymulcnst = Math.pow(10, tempdivstr.length);
            setStartNum(Number(snum) * mymulcnst);
            setDivisor(Number(divnum) * mymulcnst);
            return {"snum": Number(snum) * mymulcnst, "divnum": Number(divnum) * mymulcnst};
        }
    }

    function mulValByPowOfTen(sval, mpow)
    {
        let mystr = "" + sval;
        let mydpindx = mystr.indexOf(".");
        //console.log("mpow = " + mpow);
        //console.log("mystr = " + mystr);
        //console.log("mystr.length = " + mystr.length);
        //console.log("mydpindx = " + mydpindx);

        let pwstr = "" + mpow;
        let pwdpindx = pwstr.indexOf(".");
        if (pwdpindx < 0 || pwstr.length - 1 < pwdpindx);
        else return "" + Math.pow(Number(sval), Number(mpow));

        if (0 < mpow)
        {
            if (mydpindx < 0 || mystr.length - 1 < mydpindx)
            {
                for (let n = 0; n < mpow; n++) mystr += "0";
            }
            else
            {
                if (mydpindx + 1 === mystr.length)
                {
                    return mulValByPowOfTen(mystr.substring(0, mystr.length - 1), mpow);
                }
                //else;//do nothing

                //need to know how many digits are after the decimal point
                let numdaftrdp = mystr.length - mydpindx - 1;
                //console.log("numdaftrdp = " + numdaftrdp);

                //if the pow is more than this
                const strnodp = mystr.substring(0, mydpindx) + mystr.substring(mydpindx + 1);
                if (numdaftrdp < mpow) return mulValByPowOfTen(strnodp, mpow - numdaftrdp);
                else if (numdaftrdp === mpow) mystr = strnodp;
                else
                {
                    //pow is less than the num after but more than zero
                    //20.12 * 10 pow = 1 -> 201.2
                    //take everything before dp, skip dp, add chars until done, then dp, then rest
                    let mynwstr = mystr.substring(0, mydpindx);
                    for (let ki = 0; ki < mpow; ki++) mynwstr += mystr.charAt(mydpindx + 1 + ki);
                    mynwstr += "." + mystr.substring(mydpindx + 1 + mpow);
                    return mynwstr;
                }
            }
        }
        else if (mpow === 0) mystr = "1";
        else
        {
            //the decimal point is negative, it needs to move left,
            //need to do something similar to above
            const absmpow = mpow*(-1);
            if (mydpindx < 0 || mystr.length - 1 < mydpindx)
            {
                //there is no decimal point
                const nwdpi = mystr.length + mpow;
                //console.log("nwdpi = " + nwdpi);

                if (absmpow < mystr.length)
                {
                    mystr = mystr.substring(0, nwdpi) + "." + mystr.substring(nwdpi);
                }
                else if (absmpow === mystr.length) return "0." + mystr;
                else
                {
                    const diff = absmpow - mystr.length;
                    let mynwstr = "0.";
                    for (let n = 0; n < diff; n++) mynwstr += "0";
                    mynwstr += "" + mystr;
                    return mynwstr;
                }
            }
            else
            {
                //there is a decimal point
                //the num digits before the decimal point is the index of dp
                const strnodp = mystr.substring(0, mydpindx) + mystr.substring(mydpindx + 1);
                const nwdpi = mydpindx - absmpow;
                //console.log("nwdpi = " + nwdpi);

                if (absmpow < mydpindx)
                {
                    mystr = mystr.substring(0, nwdpi) + "." + mystr.substring(nwdpi, mydpindx) +
                    mystr.substring(mydpindx + 1);
                }
                else if (absmpow === mydpindx) return "0." + strnodp;
                else
                {
                    const diff = nwdpi*(-1);
                    let mynwstr = "0.";
                    for (let n = 0; n < diff; n++) mynwstr += "0";
                    mynwstr += "" + mystr;
                    return mynwstr;
                }
            }
        }
        return mystr;
    }
    function testMulValByPowTen()
    {
        console.log(mulValByPowOfTen(20.1, 1));//201
        console.log(mulValByPowOfTen(20.1, 2));//2010
        console.log(mulValByPowOfTen(20.12, 1));//201.2
        console.log(mulValByPowOfTen("20.", 1));//200
        console.log(mulValByPowOfTen(20, 1));//200
        console.log(mulValByPowOfTen(20, 0));//1
        console.log(mulValByPowOfTen(20, -1));//2 or 2.0
        console.log(mulValByPowOfTen(20, -2));//0.2 or .2
        console.log(mulValByPowOfTen(20, -3));//0.02 or .02
        console.log(mulValByPowOfTen(20.1, -1));//2.01
        console.log(mulValByPowOfTen(20.1, -2));//0.201 or .201
        console.log(mulValByPowOfTen(20.1, -3));//0.0201 or .0201
        console.log(mulValByPowOfTen(20.12, -1));//2.012
    }

    function convertTrueOrFalseArrayToString(marr)
    {
        if (isLetUndefinedOrNull(marr)) return null;
        else return ((marr.length < 1) ? "" : marr.map((val) => (val ? "1" : "0")).join(""));
    }

    function getStringsWithDecimalPointsAlignAndLeadingZerosIfNeeded(stra, strb)
    {
        //console.log("stra = " + stra);
        //console.log("strb = " + strb);

        letMustNotBeEmpty(stra, "stra");
        letMustNotBeEmpty(strb, "strb");

        const stradpti = stra.indexOf(".");
        const strbdpti = strb.indexOf(".");
        const strahasnodpt = isNumberInvalid(stradpti, 0, stra.length - 1);
        const strbhasnodpt = isNumberInvalid(strbdpti, 0, strb.length - 1);
        const numdgtsaftrdptstra = (strahasnodpt ? 0 : stra.length - stradpti - 1);
        const numdgtsaftrdptstrb = (strbhasnodpt ? 0 : strb.length - strbdpti - 1);
        //console.log("stradpti = " + stradpti);
        //console.log("strbdpti = " + strbdpti);
        //console.log("strahasnodpt = " + strahasnodpt);
        //console.log("strbhasnodpt = " + strbhasnodpt);
        //console.log("numdgtsaftrdptstra = " + numdgtsaftrdptstra);
        //console.log("numdgtsaftrdptstrb = " + numdgtsaftrdptstrb);

        if (numdgtsaftrdptstra === numdgtsaftrdptstrb);//do not need to add any digits after dpt
        else
        {
            //we need to add digits after the decimal point
            //either both have decimal points or one does not...
            //the one does not case is easier
            let nwstra = "";
            let nwstrb = "";
            if (strahasnodpt || strbhasnodpt)
            {
                //one or both do not have a decimal point (one does not)
                let mxnumdpts = -1;
                if (strahasnodpt)
                {
                    //need to add . and then numdgtsaftrdptstrb to the new a string
                    //b will be the same
                    nwstra = "" + stra;
                    mxnumdpts = numdgtsaftrdptstrb;
                }
                else
                {
                    //need to add . and then numdgtsaftrdptstra to the new b string
                    //a will be the same
                    nwstrb = "" + strb;
                    mxnumdpts = numdgtsaftrdptstra;
                }
                //console.log("mxnumdpts = " + mxnumdpts);

                let mydptandzerosstr = ".";
                for (let k = 0; k < mxnumdpts; k++) mydptandzerosstr += "0";
                if (strahasnodpt) nwstra += mydptandzerosstr;
                else nwstrb += mydptandzerosstr;
            }
            else
            {
                //both have decimal points
                //3.2
                //  3.2
                //456.256
                //-3.2        (needs some zeros after the dpt)
                //456.23456
                //012345678
                //need to know how many digits after the decimal point they have
                //if the digits after the decimal point are equal, then no zeros after the dpt
                //else we need zeros after the dpt
                //need to figure out which one to add the zeros to

                const keepaasis = (numdgtsaftrdptstrb < numdgtsaftrdptstra);
                let mxnumdpts = -1;
                if (keepaasis)
                {
                    //a has more than b keep a as is
                    mxnumdpts = numdgtsaftrdptstra - numdgtsaftrdptstrb;
                    nwstrb = "" + strb;
                }
                else
                {
                    //b has more than a keep b as is
                    mxnumdpts = numdgtsaftrdptstrb - numdgtsaftrdptstra;
                    nwstra = "" + stra;
                }
                //console.log("keepaasis = " + keepaasis);
                //console.log("mxnumdpts = " + mxnumdpts);

                let myzerosstr = "";
                for (let k = 0; k < mxnumdpts; k++) myzerosstr += "0";
                if (keepaasis) nwstrb += myzerosstr;
                else nwstra += myzerosstr;
            }
            //console.log("nwstra = " + nwstra);
            //console.log("nwstrb = " + nwstrb);

            return getStringsWithDecimalPointsAlignAndLeadingZerosIfNeeded(
                (isLetEmptyNullOrUndefined(nwstra) ? stra : nwstra),
                (isLetEmptyNullOrUndefined(nwstrb) ? strb : nwstrb));
        }

        //need to add the leading zeros here...
        //leading zeros do not include the minus sign
        const aisnegative = (stra.charAt(0) === '-');
        const bisnegative = (strb.charAt(0) === '-');
        //console.log("aisnegative = " + aisnegative);
        //console.log("bisnegative = " + bisnegative);

        const numdigitsbfrdpta = (strahasnodpt ? (aisnegative ? stra.length - 1 : stra.length) :
            (aisnegative ? stradpti - 1 : stradpti));
        const numdigitsbfrdptb = (strbhasnodpt ? (bisnegative ? strb.length - 1 : strb.length) :
            (bisnegative ? strbdpti - 1 : strbdpti));
        //console.log("numdigitsbfrdpta = " + numdigitsbfrdpta);
        //console.log("numdigitsbfrdptb = " + numdigitsbfrdptb);

        if (numdigitsbfrdpta === numdigitsbfrdptb) return [stra, strb];
        else
        {
            //need to add the leading zeros here to one of the strings
            const keepaasis = (numdigitsbfrdptb < numdigitsbfrdpta);
            //console.log("keepaasis = " + keepaasis);

            const adiff = numdigitsbfrdpta - numdigitsbfrdptb;
            const numzeros = (keepaasis ? adiff : (-1) * adiff);
            let myzerosstr = "";
            for (let k = 0; k < numzeros; k++) myzerosstr += "0";
            let nwstra = "";
            let nwstrb = "";
            if (keepaasis)
            {
                const si = (bisnegative ? 1 : 0);
                nwstrb = (bisnegative ? "-" : "") + myzerosstr + strb.substring(si);
                return [stra, nwstrb];
            }
            else
            {
                const si = (aisnegative ? 1 : 0);
                nwstra = (aisnegative ? "-" : "") + myzerosstr + stra.substring(si);
                return [nwstra, strb];
            }
        }
    }

    function addOrSubtractTwoStrings(stra, strb, useadd)
    {
        //console.log("stra = " + stra);
        //console.log("strb = " + strb);
        //console.log("useadd = " + useadd);

        letMustNotBeEmpty(stra, "stra");
        letMustNotBeEmpty(strb, "strb");
        letMustBeBoolean(useadd, "useadd");

        const aisnegative = (stra.charAt(0) === '-');
        const bisnegative = (strb.charAt(0) === '-');
        const nwstra = stra.substring(1);
        const nwstrb = strb.substring(1);
        //console.log("aisnegative = " + aisnegative);
        //console.log("bisnegative = " + bisnegative);
        //console.log("nwstra = " + nwstra);
        //console.log("nwstrb = " + nwstrb);

        if (useadd)
        {
            //adding
            //if a is negative and b is negative, -1+-2=-1-2=-1*(1+2)=-3
            //-multiply both by -1 then add then multiply the answer by -1
            //if a is negative and b is positive, -1+2 then we subtract
            //-but b is the new a and a is new b
            //if a is positive and b is negative, 2+-1, the we subtract multiply b by negative 1
            //if a is positive and b is positive, then we add
            if (aisnegative)
            {
                //a is negative and adding
                if (bisnegative)
                {
                    //b is negative and a is negative and adding
                    //-1+-2=-3
                    return "-" + addOrSubtractTwoStrings(nwstra, nwstrb, true);
                }
                else
                {
                    //b is positive and a is negative
                    //-2+1=1-2=-1
                    //we want to subtract a from b
                    return addOrSubtractTwoStrings(strb, stra, false);
                }
            }
            else
            {
                //a is positive and adding
                if (bisnegative)
                {
                    //b is negative
                    //3+-2=3-2=1
                    return addOrSubtractTwoStrings(stra, nwstrb, false);
                }
                //else;//do nothing b is positive proceed below
            }
        }
        else
        {
            //subtracting
            //if a is negative and b is positive -1-2=-3 we add then multiply by -1
            //if a is positive and b is positive, we subtract 3-2
            //if b is negative and a is positive, we add 1--1=1+1=2,
            //if b is negative and a is negative, -1--2=-1+2: we make b positive,
            //then subtract a from b
            if (aisnegative)
            {
                //a is negative and subtracting
                //b is positive and subtracting
                //-3-2=-5
                //multiply both by -1 and add then then multiply the answer by -1
                //b is negative and subtracting
                //-3--2=-3+2=2-3
                let tempretval = addOrSubtractTwoStrings(nwstra, nwstrb, !bisnegative);
                return (bisnegative ? tempretval : "-" + tempretval);
            }
            else
            {
                //a is positive and subtracting
                if (bisnegative)
                {
                    //b is negative and subtracting
                    //3--2=3+2
                    return addOrSubtractTwoStrings(stra, nwstrb, true);
                }
                //else;//do nothing a is positive and b is positive and subtracting
            }

            //if b is bigger than a, 3-4=-1=-1*(4-3)
            //if a is bigger than b, 4-3=1
            if (Number(stra) < Number(strb))
            {
                //b is bigger than a
                //return -1*(b - a)
                return "-" + addOrSubtractTwoStrings(strb, stra, false);
            }
            //else;//do nothing safe to proceed
        }

        const tempnewstrs = getStringsWithDecimalPointsAlignAndLeadingZerosIfNeeded(stra, strb);
        //console.log("tempnewstrs = ", tempnewstrs);

        if (stra === tempnewstrs[0] && strb === tempnewstrs[1]);
        else return addOrSubtractTwoStrings(tempnewstrs[0], tempnewstrs[1], useadd);

        if (useadd)
        {
            //adding
            //just do the digit by digit addition
            //9+9+1=max 18 max carry is 1
            //do not forget the carry
            if (truncateAndRemoveUnnecessaryZerosIfCan(stra) === '0')
            {
                //console.log("FINAL ansstr = strb = " + strb);
                return "" + strb;
            }
            else if (truncateAndRemoveUnnecessaryZerosIfCan(strb) === '0')
            {
                //console.log("FINAL ansstr = stra = " + stra);
                return "" + stra;
            }
            //else;//do nothing proceed below
            
            let carry = false;
            let ansstr = "";
            for (let i = stra.length - 1; (i === 0 || 0 < i) && i < stra.length; i--)
            {
                if (stra.charAt(i) === ".") ansstr = "." + ansstr;
                else
                {
                    let dval = Number(stra.charAt(i)) + Number(strb.charAt(i)) + (carry ? 1 : 0);
                    if (9 < dval) ansstr = "" + (dval - 10) + ansstr;
                    else if (dval < 0) throw new Error("dval must be at least zero!");
                    else ansstr = "" + dval + ansstr;
                    carry = (9 < dval);
                    //console.log("NEW ansstr = " + ansstr);
                    //console.log("NEW carry = " + carry);
                }
            }
            if (carry) ansstr = "1" + ansstr;
            //else;//do nothing
            //console.log("FINAL ansstr = " + ansstr);
            
            return ansstr;
        }
        else
        {
            //subtracting
            //a will always be bigger than b now
            //the decimal points align
            //need to know when we are borrowing
            //must borrow:
            //if at decimal point, then no
            //if adigit < bdigit, then yes
            //if bdigit < adigit, then no
            //if adigit === bdigit, then search after this for one of the conditions above
            //-if one above is found: then these are all those values
            //-if not found, then no
            
            //then do a bit shift totally ignoring the decimal point for the moment
            
            //then answer digit = adigit (if must borrow, then add 10) - bdigit - bitshiftval

            let mstbrw = [];
            for (let i = 0; i < stra.length; i++)
            {
                if (stra.charAt(i) === '.') mstbrw.push(false);
                else
                {
                    let anum = Number("" + stra.charAt(i));
                    let bnum = Number("" + strb.charAt(i));
                    mstbrw.push((anum < bnum));
                }
            }
            //console.log("init mstbrw = ", mstbrw);

            for (let i = 0; i < stra.length; i++)
            {
                if (stra.charAt(i) === '.');
                else
                {
                    let anum = Number("" + stra.charAt(i));
                    let bnum = Number("" + strb.charAt(i));
                    if (anum === bnum)
                    {
                        for (let k = i; k < stra.length; k++)
                        {
                            if (stra.charAt(k) === '.');
                            else
                            {
                                let tempanum = Number("" + stra.charAt(k));
                                let tempbnum = Number("" + strb.charAt(k));
                                let setequdgtsnow = false;
                                let nwvalforequdgts = false;
                                if (tempanum === tempbnum)
                                {
                                    if (k + 1 < stra.length);
                                    else
                                    {
                                        setequdgtsnow = true;
                                        nwvalforequdgts = false;
                                    }
                                }
                                else
                                {
                                    setequdgtsnow = true;
                                    nwvalforequdgts = (tempanum < tempbnum);
                                }
                                //console.log("setequdgtsnow = " + setequdgtsnow);

                                if (setequdgtsnow)
                                {
                                    //console.log("nwvalforequdgts = " + nwvalforequdgts);

                                    for (let n = i; n < k; n++)
                                    {
                                        mstbrw[n] = nwvalforequdgts;
                                        //console.log("NEW mstbrw[" + n + "] = " + mstbrw[n]);
                                    }
                                    i = k;
                                    //console.log("NEW i = " + i);
                                    
                                    break;
                                }
                                //else;//do nothing
                            }
                        }//end of k for loop
                    }
                    //else;//do nothing
                }
            }//end of i for loop
            //console.log("FINAL mstbrw = ", mstbrw);
            
            // 20.7
            //-03.6
            // 0100 (must borrow)
            // 1000 (num times need to borrow)

            // 2,10.7 (adigits + base if must borrow)
            //-0, 3.6 (bdigits)
            //-1, 0.0 (num times need to borrow)
            // 1  7.1 (answer)

            //for the bitshift
            //we ignore the first altogether
            //copy from 1 to decimal point index,
            //at dpi get the next one, then add dptval, then continue copying them
            //then add 0 or false at the end
            let numbrw = [];
            for (let i = 1; i < stra.length; i++)
            {
                if (stra.charAt(i) === '.');
                else
                {
                    numbrw.push(mstbrw[i]);
                    if (stra.charAt(i - 1) === '.') numbrw.push(false);
                    //else;//do nothing
                }
            }
            numbrw.push(false);
            //console.log("numbrw = ", numbrw);

            let ansstr = "";
            let dispastr = "";
            let dispbstr = "";
            let dispbrwstr = "";
            let dispansstr = "";
            for (let i = 0; i < stra.length; i++)
            {
                if (stra.charAt(i) === '.')
                {
                    ansstr += ".";
                    dispastr += ".";
                    dispbstr += ".";
                    dispbrwstr += ".";
                    dispansstr += ".";
                }
                else
                {
                    let anum = Number("" + stra.charAt(i));
                    let bnum = Number("" + strb.charAt(i));
                    let brwnum = (numbrw[i] ? 1 : 0);
                    let finanum = (mstbrw[i] ? anum + 10 : anum);
                    let dval = finanum - bnum - brwnum;
                    if (dval < 0 || 9 < dval) throw new Error("illegal answer digit value!");
                    //else;//do nothing
                    ansstr += "" + dval;
                    dispastr += "" + finanum;
                    dispbstr += "" + ((9 < finanum) ? " " + bnum : "" + bnum);
                    dispbrwstr += "" + ((9 < finanum) ? " " + brwnum : "" + brwnum);
                    dispansstr += "" + ((9 < finanum) ? " " + dval : "" + dval);
                    if (i + 1 < stra.length)
                    {
                        if (stra.charAt(i + 1) === '.');
                        else
                        {
                            dispastr += ",";
                            dispbstr += ",";
                            dispbrwstr += ",";
                            dispansstr += ",";
                        }
                    }
                    //else;//do nothing
                }
            }
            //console.log("RESULTS:");
            //console.log("  stra = " + stra);
            //console.log("- strb = " + strb);
            //console.log("mstbrw = " + convertTrueOrFalseArrayToString(mstbrw));
            //console.log("numbrw = " + convertTrueOrFalseArrayToString(numbrw));
            //console.log("ansstr = " + ansstr);
            //console.log(" " + dispastr);
            //console.log("-" + dispbstr);
            //console.log("-" + dispbrwstr);
            //console.log("=" + dispansstr);
            
            if (mstbrw[0])
            {
                //technically our real answer - base^x place is what this is.
                let mynwastr = "1";
                for (let i = 0; i < stra.length; i++)
                {
                    mynwastr += ((stra.charAt(i) === '.') ? "." : "0");
                }
                //console.log("RESULTS ARE WRONG BECAUSE THE ANSWER SHOULD BE NEGATIVE!");
                //console.log("mynwastr = " + mynwastr);

                return "-" + addOrSubtractTwoStrings(mynwastr, ansstr, false);
            }
            else return ansstr;
        }
    }
    function truncAndRemZerosAddOrSubtractTwoStrings(stra, strb, useadd)
    {
        return truncateAndRemoveUnnecessaryZerosIfCan(addOrSubtractTwoStrings(stra, strb, useadd));
    }
    function addTwoStrings(stra, strb) { return addOrSubtractTwoStrings(stra, strb, true); }
    function subtractTwoStrings(stra, strb) { return addOrSubtractTwoStrings(stra, strb, false); }
    function truncAndRemZerosAddTwoStrings(stra, strb)
    {
        return truncAndRemZerosAddOrSubtractTwoStrings(stra, strb, true);
    }
    function truncAndRemZerosSubtractTwoStrings(stra, strb)
    {
        return truncAndRemZerosAddOrSubtractTwoStrings(stra, strb, false);
    }

    function verifyAddOrSubtractingResults(stra, strb, ansarr, useadd)//, usedecs=false
    {
        letMustBeBoolean(useadd, "useadd");
        //letMustBeBoolean(usedecs, "usedecs");
        letMustNotBeEmpty(ansarr, "ansarr");
        const funcname = (useadd ? addTwoStrings : subtractTwoStrings);
        //(usedecs ? subtractTwoDecimals : )
        const resval = "" + funcname(stra, strb);
        const addsubstr = (useadd ? "add" : "subtract");
        const resisare = (ansarr.length === 1 ? " is" : "s are");
        console.log("result of " + addsubstr + "ing " + stra + " and " + strb + " is " + resval +
            " and the expected result" + resisare + " " + ansarr + ".");
        let ansfnd = false;
        for (let n = 0; n < ansarr.length; n++)
        {
            if (resval === ansarr[n])
            {
            ansfnd = true;
            return true;
            }
            //else;//do nothing
        }
        if (ansfnd) return true;
        else throw new Error("the results must match!");
    }
    function verifyAddingResults(stra, strb, ansarr)
    {
        return verifyAddOrSubtractingResults(stra, strb, ansarr, true);
    }
    function verifySubtractingResults(stra, strb, ansarr)
    {
        return verifyAddOrSubtractingResults(stra, strb, ansarr, false);
    }

    function testAddingOrSubtractingStrings()
    {
        verifyAddingResults("20.1", "3", ["23.1"]);
        verifyAddingResults("3", "20.1", ["23.1"]);
        verifyAddingResults("20.1", "3.0", ["23.1"]);
        verifyAddingResults("20.1", "3.9", ["24.0", "24"]);
        verifyAddingResults("20", "0.000000001", ["20.000000001"]);
        verifyAddingResults("20.0", "0.000000001", ["20.000000001"]);
        verifyAddingResults("20.000000001", "0.999999999", ["21.000000000", "21.0", "21"]);
        verifyAddingResults("80", "40", ["120"]);
        verifyAddingResults("40", "80", ["120"]);
        //subtraction now
        verifySubtractingResults("20.7", "3.6", ["17.1"]);//, false
        verifySubtractingResults("20.1", "3", ["17.1"]);//, false
        verifySubtractingResults("200", "31", ["169"]);//, false
        //verifySubtractingResults("200", "31", ["169"]);//, true
        //200
        //-31
        //100 (diff a minus b is at least one)
        //011 (must borrow at digit)
        //100 (can borrow from digit)
        //100 (must borrow from digit)
        //110 (num times need to borrow at digit)
        //2,10,10
        //0, 3, 1
        //1, 1, 0
        //1, 6, 9
        verifySubtractingResults("3.1", "20", ["-16.9", "-016.9"]);//, false
        verifySubtractingResults("20", "3.1", ["16.9"]);//, false
        verifySubtractingResults("3.1", "20.0", ["-16.9", "-016.9"]);//, false
        verifySubtractingResults("20.0", "3.1", ["16.9"]);//, false
        verifySubtractingResults("20", "0.000000001", ["19.999999999"]);//, false
        verifySubtractingResults("20.000000000", "0.000000001", ["19.999999999"]);//, false
        verifySubtractingResults("20.090020", "19.189999", ["00.900021", "0.900021"]);//, false
        verifySubtractingResults("20.090020", "19.199999", ["00.890021", "0.890021"]);//, false
        verifySubtractingResults("20.10905", "19.11020", ["0.99885", "00.99885"]);//, false
        // -1 10,10,8,10,0
        // -1 0,10,8,10,0
        //    0,10,8,10,0 (then the 10 was added to the other place)
        //    0,0,8,10,0 (the 1 turned into a 0, that is why this is the same)
        //    0,0,8,10,0
        //    0,0,8,0,0
        // 20.10905
        //-19.11020
        //  0.99885
        // 01 01010 (init must borrow at digit)
        // 01 11010 (FINAL must borrow at digit)
        // 10 00101 (diff a minus b digit is at least one)
        // 10 10101 (can borrow from digit)
        // 10 00101 (at a section boundary)
        // 11 10100 (num times need to borrow)
        // 2,10.11,10,9,10,5
        //-1, 9. 1, 1,0, 2,0
        //-1, 1  1, 0,1, 0,0
        // 0, 0. 9, 9,8, 8,5
        verifySubtractingResults("20.0905", "19.1020", ["0.9885", "00.9885"]);//, false
        // -1 10,8,10,0
        // -1 0,8,10,0
        //    0,8,10,0
        //    0,8,0,0
        // 20.0905
        //-19.1020
        //  0.9885
        // 10 0101 (diff a minus b is at least one)
        // 01 1010 (must borrow at digit)
        // 10 0101 (can borrow from digit)
        // 10 0101 (at a section boundary)
        // 11 0100 (num times need to borrow at digit)
        // 2,10.10,9,10,5
        //-1, 9. 1,0, 2,0
        //-1, 1. 0,1, 0,0
        //=0, 0. 9,8, 8,5
        verifySubtractingResults("3", "4", ["-1", "-01"]);//, false
        //throw new Error("NEED TO CHECK RESULTS NOW!");
    }

    function multiplyTwoStrings(stra, strb)
    {
        //  
        // 123
        //*456
        //------
        //   738
        //  6150
        //+49200
        //------
        // 56088
        
        //  | 5 |
        //  -----
        //0 |0/5| 1
        //  +----
        // /|0/0| 0
        //5 +----
        // /  0

        //  | 1 | 2 | 3 |
        //  -------------
        //  |0/4+0/8+1/2| 4 => 04,08,12
        //0 +---+---+----      65 54 43 (lattice col numbers)
        // /|0/5+1/0+1/5| 5    05,10,15
        //5 +---+---+----      54 43 32 (lattice col numbers)
        // /|0/6+1/2+1/8| 6    06,12,18
        //6 +---+---+----      43 32 21 (lattice col numbers)
        // / 0 / 8 /  8
        //
        //                     on the max row, the lattice col numbers starts at 1
        //                     the max lattice col number on the row will be array_max_col+1
        //                     on the second to max row, the max lattice col number =
        //                     the max lattice col number on the previous row + 1
        //                     ...
        //                     the lattice row numbers = 1 + max_arr_row_num - arr_row_num
        //
        //this is also the same way addition is done from right to left
        //
        //-add up number of digits on both numbers excluding decimal points (only have 1 decimal point)
        //that is how long the answer will be if you count a leading zero if present
        //-you count the number of digits after the decimal points on both numbers
        //this tells you where to put the decimal point
        //-ones place is added with the tens place in previous box on the same row
        //lattice multiplication does not have to be square
        //
        //once we identify the digits on the same lattice cols, add them up
        //starting with lattice col 1 and increasing IE right to left like addition
        //if the answer is more than 9, set the carry value
        //the next lattice col includes that carry value
        //if no carry now reset carry to zero
        //
        //RULE: if a or b is zero, then the answer is zero
        //RULE: if a is 1, then the answer is b
        //RULE: if b is 1, then the answer is a
        //RULE: if a is -1, then the answer is -1*b
        //RULE: if b is -1, then the answer is -1*a
        //RULE: if both a and b are negative, then the answer is positive
        //RULE: if one is negative and the other is positive, then negative (zero is the exception)
        //otherwise do lattice or digit by digit multiplication

        //first make a two d string array to hold our values
        //do the multiplication up to 9*9 and 0*anything
        //let the computer store these as numbers on the cols, but otherwise as digits
        //when generating this we will ignore the decimal point if encountered...
        //ignore the sign for the moment that will be taken care of at the end...
        //so will the decimal point...
        if (truncateAndRemoveUnnecessaryZerosIfCan(stra) === '0' ||
            truncateAndRemoveUnnecessaryZerosIfCan(strb) === '0')
        {
            return "0";
        }
        else if (truncateAndRemoveUnnecessaryZerosIfCan(stra) === "1") return strb;
        else if (truncateAndRemoveUnnecessaryZerosIfCan(strb) === "1") return stra;
        else if (truncateAndRemoveUnnecessaryZerosIfCan(stra) === "-1")
        {
            return ((strb.charAt(0) === '-') ? strb.substring(1) : "-" + strb);
        }
        else if (truncateAndRemoveUnnecessaryZerosIfCan(strb) === "-1")
        {
            return ((stra.charAt(0) === '-') ? stra.substring(1) : "-" + stra);
        }
        else
        {
            if ((truncateAndRemoveUnnecessaryZerosIfCan(stra) === stra) &&
                (truncateAndRemoveUnnecessaryZerosIfCan(strb) === strb))
            {
                //do nothing safe to proceed below
            }
            else
            {
                return multiplyTwoStrings(truncateAndRemoveUnnecessaryZerosIfCan(stra),
                    truncateAndRemoveUnnecessaryZerosIfCan(strb));
            }
        }
        const straisnegative = (stra.charAt(0) === '-');
        const strbisnegative = (strb.charAt(0) === '-');
        const stradpti = stra.indexOf(".");
        const strbdpti = strb.indexOf(".");
        const strahasnodpt = isNumberInvalid(stradpti, 0, stra.length - 1);
        const strbhasnodpt = isNumberInvalid(strbdpti, 0, strb.length - 1);
        const numdgtsafterdpta = (strahasnodpt ? 0 : (stra.length - stradpti - 1));
        const numdgtsafterdptb = (strbhasnodpt ? 0 : (strb.length - strbdpti - 1));
        const ansispositive = (straisnegative === strbisnegative);
        const numdgtsaftrdptans = numdgtsafterdpta + numdgtsafterdptb;

        //let stra = 123
        //let strb = 456
        //console.log("stra = " + stra);
        //console.log("strb = " + strb);

        let mularr = [];
        let mystrsarr = [];
        for (let i = 0; i < strb.length; i++)
        {
            if (strb.charAt(i) === '-' || strb.charAt(i) === '.');
            else if (isDigit("" + strb.charAt(i)))
            {
                let bnum = Number("" + strb.charAt(i));
                let myrowarr = [];
                for (let k = 0; k < stra.length; k++)
                {
                    if (stra.charAt(k) === '-' || stra.charAt(k) === '.');
                    else if (isDigit("" + stra.charAt(k)))
                    {
                        let anum = Number("" + stra.charAt(k));
                        let numans = anum * bnum;
                        myrowarr.push(((numans < 10) ? "0" : "") + numans);
                    }
                    else throw new Error("invalid character found here on stra at k = " + k + "!");
                }
                mularr.push(myrowarr);
                mystrsarr.push(myrowarr.join(""));
            }
            else throw new Error("invalid character found here on strb at i = " + i + "!");
        }
        //console.log("mularr = ", mularr);
        //console.log("mystrsarr = ", mystrsarr);

        let mxlccolsnums = mularr.map((val, indx) => val.length + (mularr.length - indx));
        //console.log("mxlccolsnums = ", mxlccolsnums);

        let dgtcolnumstrs = mystrsarr.map((val, indx) => {
            //console.log("val = " + val);
            //console.log("indx = " + indx);
            //console.log("mxlccolsnums[" + indx + "] = " + mxlccolsnums[indx]);
            
            //the first one is only one else the next one is the same value too
            //the last one is only one
            let mytempclnumarr = [mxlccolsnums[indx]];
            let lastnum = mytempclnumarr[0];
            for (let i = 1; i + 2 < val.length; i += 2)
            {
                let mylcclnumval = mxlccolsnums[indx] - ((i+1)/2);
                lastnum = mylcclnumval;
                mytempclnumarr.push(mylcclnumval);
                mytempclnumarr.push(mylcclnumval);
            }
            mytempclnumarr.push(lastnum - 1);
            //console.log("mytempclnumarr = ", mytempclnumarr);

            return mytempclnumarr;
        });
        //console.log("dgtcolnumstrs = ", dgtcolnumstrs);

        //now get the sums
        //need our lc col num to increment to the max val and include it
        let mcarry = 0;
        let myansstr = "";
        for (let n = 1; n < mxlccolsnums[0] + 1; n++)
        {
            //console.log("n = " + n);

            let ansdgtval = mcarry;
            for (let r = dgtcolnumstrs.length - 1; (r === 0 || 0 < r) && r < dgtcolnumstrs.length; r--)
            {
                for (let c = dgtcolnumstrs[r].length - 1;
                    (c === 0 || 0 < c) && c < dgtcolnumstrs[r].length; c--)
                {
                    //console.log("dgtcolnumstrs[" + r + "][" + c + "] = " + dgtcolnumstrs[r][c]);
                    
                    if (n === dgtcolnumstrs[r][c])
                    {
                        //now get the value from the string
                        //console.log(mystrsarr[r][c]);
                        ansdgtval += Number(mystrsarr[r][c]);
                    }
                    //else;//do nothing
                }//end of c for loop
            }//end of r for loop
            //console.log("ansdgtval = " + ansdgtval);
            //console.log("mcarry = " + mcarry);

            if (ansdgtval < 10) mcarry = 0;
            else
            {
                let tempansstr = "" + ansdgtval;
                let nwvalstr = tempansstr.substring(tempansstr.length - 1);
                mcarry = Number(tempansstr.substring(0, tempansstr.length - 1));
                ansdgtval = Number(nwvalstr);
                //console.log("NEW ansdgtval = " + ansdgtval);
            }
            //console.log("NEW mcarry = " + mcarry);

            myansstr = "" + ansdgtval + myansstr;
            //console.log("NEW myansstr = " + myansstr);
        }//end of n for loop
        if (ansispositive);
        else myansstr = "-" + myansstr;
        //123*456=
        //056088
        //0123456
        //1.23*45.6=
        //056.088
        //insert dpt at length - 1 - n
        //console.log("ansispositive = " + ansispositive);
        //console.log("numdgtsaftrdptans = " + numdgtsaftrdptans);

        if (0 < numdgtsaftrdptans)
        {
            let mytempdpti = myansstr.length - numdgtsaftrdptans;
            myansstr = myansstr.substring(0, mytempdpti) + "." + myansstr.substring(mytempdpti);
        }
        //else;//do nothing
        //console.log("FINAL myansstr = " + myansstr);

        return truncateAndRemoveUnnecessaryZerosIfCan(myansstr);
    }

    function testMultiplyTwoStrings()
    {
        console.log(multiplyTwoStrings("123", "0"));
        console.log(multiplyTwoStrings("0", "123"));
        console.log(multiplyTwoStrings("123", "1"));
        console.log(multiplyTwoStrings("1", "123"));
        console.log(multiplyTwoStrings("123", "-1"));
        console.log(multiplyTwoStrings("-1", "123"));
        console.log(multiplyTwoStrings("123", "-2"));
        console.log(multiplyTwoStrings("-2", "123"));
        console.log(multiplyTwoStrings("123", "456"));//056088
        console.log(multiplyTwoStrings("1.23", "45.6"));//056.088
        throw new Error("NEED TO CHECK THE RESULTS HERE NOW!");
    }

    //1. get rid of decimal in the divisor by multiplying by 10 until not there
    //2. you will also multiply the start number by 10 each time you multiplied the divisor by 10
    //NOTE: keep in mind the start number may still have a decimal in it
    //6.7|2.211 -> 67|22.11|
    //0.5|12.5  ->  5|125|
    //
    //  ------        -----         -------        -----        ------
    // 8|1720|       5|125|       67|22.11|       5|525|       4|1.00|
    // - 1600|200    - 100|20       -20.10|0.3    - 500|100    - 0.80| 0.2
    //   ----|        ----|          -----|       -----|        -----|
    //    120|          25|           2.01| .03      25|         0.20|
    // -   80|+10    -  25|+5        -2.01|         -25|+5       0.20|+0.05
    //   ----|        ----|          -----|       -----|        -----|
    //     40|           0|25            0|0.33       0|105         0| 0.25
    // -   40|+5
    //   ----|
    //      0|215
    //
    //3. list out 10 multiples of our divisor (only do once for reference)
    //4. take the first digit of the start num and
    //see if the divisor has any multiple that goes into it
    //4A: If not take the first k digits see 4
    //4B: If it does, for instance 12 has 5 and 10 in it.
    //the first two digits on 125 is 12 which has 10. 10 is 2*5.
    //So our answer has a 2 in it as the first digit.
    //But since the last digit in the k digits gives us the place from the decimal point.
    //So 2*10^placedif goes into the answer
    //5. the sub number = multiple_of_divisor_used*10^placediff
    //6. the new startnum = startnum - the sub number
    //7. repeat 4 through 6 until remainder is zero OR until decimal repeats OR
    //the decimal places have been reached OR until you know the remainder.

    function genRowDataObject(isminusrow, moraval, isfinans, ptans)
    {
        //we will put the partial on the minus row
        //but we will put the final answer on the final answer row
        letMustBeBoolean(isminusrow, "isminusrow");
        letMustBeBoolean(isfinans, "isfinans");
        letMustBeANumber(moraval, "moraval");
        letMustBeANumber(ptans, "ptans");
        let myretobj = {"isminusrow": isminusrow, "value": moraval};
        if (isminusrow) myretobj["partialanswer"] = ptans;
        else
        {
            if (isfinans) myretobj["finalanswer"] = ptans;
            //else;//do nothing
        }
        return myretobj;
    }
    function genMinusRowDataObject(moraval, ptans)
    {
        return genRowDataObject(true, moraval, false, ptans);
    }
    function genAnswerRowDataObject(moraval, isfinans, ptans="0")
    {
        return genRowDataObject(false, moraval, isfinans, ptans);
    }
    function genFinalAnswerRowDataObject(moraval, ptans)
    {
        return genAnswerRowDataObject(moraval, true, ptans);
    }
    function genPartialAnswerRowDataObject(moraval)
    {
        return genAnswerRowDataObject(moraval, false, "0");
    }

    function genFinalDataRows(prevrows, nwsubnumstr, ptansstr, finnwsnumstr, isdone, nwansstr="0")
    {
        const mycrows = [genMinusRowDataObject(nwsubnumstr, ptansstr),
            genAnswerRowDataObject(finnwsnumstr, isdone, nwansstr)];
        console.log("mycrows = ", mycrows);
        
        let myfinrows = (isLetEmptyNullOrUndefined(prevrows) ? [] :
            prevrows.map((val) => val));
        myfinrows.push(mycrows[0]);
        myfinrows.push(mycrows[1]);
        console.log("myfinrows = ", myfinrows);

        return myfinrows;
    }
    function genFinalDataRowsPartialAnswer(prevrows, nwsubnumstr, ptansstr, finnwsnumstr)
    {
        return genFinalDataRows(prevrows, nwsubnumstr, ptansstr, finnwsnumstr, false, "0");
    }
    function genFinalDataRowsFinalAnswer(prevrows, nwsubnumstr, ptansstr, finnwsnumstr, nwansstr)
    {
        return genFinalDataRows(prevrows, nwsubnumstr, ptansstr, finnwsnumstr, true, nwansstr);
    }


    function getOrigStartNum(prevrows, valempty="0")
    {
        letMustBeANumber(valempty, "valempty");
        if (Number(valempty) < 0) throw new Error("valempty must be at least zero!");
        //else;//do nothing
        const noprevrows = isLetEmptyNullOrUndefined(prevrows);
        if (noprevrows || prevrows.length % 2 === 0);
        else throw new Error("prevrows length must be even, but it was not!");
        return (noprevrows ? valempty : truncAndRemZerosAddTwoStrings(prevrows[0].value,
            prevrows[1].value));
    }

    //if mdivnum is zero, then true otherwise it returns true if it equals the base
    //if mdivnum is not an integer, then false
    function isPerfectPowerOf(mdivnum, mbase)
    {
        if (mbase === 0) throw new Error("cannot divide by zero!");
        else if (mdivnum < 0) return isPerfectPowerOf((-1) * mdivnum, mbase);
        else if (canTruncate("" + mdivnum));
        else return false;
        if (mdivnum === 1 || mdivnum === 0) return true;
        //else;//do nothing

        //for (let n = mdivnum; (0 < n || n === 0) && n < mdivnum + 1; n /= mbase)
        //{
            //if (n === 1 || n === 0) return true;
            //else;//do nothing
        //}
        let total = 0;
        for (let n = 0; n < mdivnum; n++)
        {
            if (n === 1) total = mbase;
            else total *= mbase;
            if (total === mdivnum) return true;
            if (mdivnum < total) break;
            //else;//do nothing
        }
        return false;
    }

    //note a false result on this method does not gurantee that it will not terminate
    //but it is likely not to terminate
    //this depends on the start number as well, but cannot be seen before hand
    //for example if start number is 3 and the divisor is 3 3/3 = 1 and terminates
    //for example if the start number is 1 and the divisor is 3 1/3 = 0.33333333... does not terminate
    //but does repeat forever.
    //some calculations never terminate and do not repeat like PI because PI is irrational for example.
    //If it is rational, there exists some fraction that accurately represents said decimal.
    //If not, then this is not true.
    //for a decimal to terminate, it must be some perfect power of 2, 5, or 10 and 2*5=10
    //0 although it is not a perfect power, it is treated as if it is.
    function decimalWillTerminate(divisorstr)
    {
        letMustNotBeEmpty(divisorstr, "divisorstr");
        if (canTruncate(divisorstr))
        {
            const mytruncdivisorstr = truncateAndRemoveUnnecessaryZerosIfCan(divisorstr);
            //if it is a perfect power of 2,5,10 the decimal is guranteed to terminate
            //otherwise it is not.
            //2/2=1
            const mydivnum = Number(mytruncdivisorstr);
            return (isPerfectPowerOf(mydivnum, 2) || isPerfectPowerOf(mydivnum, 10));
        }
        else return false;
    }

    function getCurrentMultipleDataObject(divtenmultiples, snumstr)
    {
        letMustNotBeEmpty(divtenmultiples, "divtenmultiples");
        letMustBeANumber(snumstr, "snumstr");
        if (divtenmultiples.length === 10);
        else throw new Error("divtenmultiples must have 10 numbers on it!");

        const mynwtempsnum = Number(snumstr);
        //console.log("snumstr = " + snumstr);

        let omi = -1;
        let omval = 0;
        let isdone = false;
        for (let n = 0; n < 10; n++)
        {
            if (snumstr === divtenmultiples[n])
            {
                omi = n;
                omval = divtenmultiples[n];
                isdone = true;
                break;
            }
            else
            {
                //get the maximum that is less than the start number then...
                if (Number(divtenmultiples[n]) < mynwtempsnum)
                {
                    omi = n;
                    omval = divtenmultiples[n];
                }
                //else;//do nothing
            }
        }//end of n for loop
        //console.log("omi = " + omi);
        //console.log("omval = " + omval);
        //console.log("isdone = " + isdone);

        return {"index": omi, "value": omval, "isdone": isdone};
    }

    function genRetValOrCallAgain(truncdsnumstr, divnumstr, divtenmultiples, stopatremdr,
        numdcsinans, nwremdr, isdone, prevrows, prevans, ptansstr, initvalforsub,
        nwsubnumstr)
    {
        letMustBeBoolean(stopatremdr, "stopatremdr");
        letMustBeBoolean(isdone, "isdone");
        letMustBeANumber(numdcsinans, "numdcsinans");
        letMustBeANumber(ptansstr, "ptansstr");
        letMustBeANumber(initvalforsub, "initvalforsub");
        letMustBeANumber(nwsubnumstr, "nwsubnumstr");
        letMustBeANumber(truncdsnumstr, "truncdsnumstr");
        letMustBeANumber(divnumstr, "divnumstr");
        letMustBeANumber(prevans, "prevans");
        letMustBeANumber(nwremdr, "nwremdr");
        letMustNotBeEmpty(divtenmultiples, "divtenmultiples");
        letNumberMustBeValid(Number(nwremdr), 0, Math.abs(Number(divnumstr)), false, "nwremdr");
        if (Number(prevans) < 0) throw new Error("previous answer must not be negative!");
        //else;//do nothing
        if (divtenmultiples.length === 10);
        else throw new Error("the divtenmultiples list must have 10 numbers on it, but it did not!");

        const finnwsnumstr = truncAndRemZerosSubtractTwoStrings(initvalforsub, nwsubnumstr);
        const nwansstr = truncAndRemZerosAddTwoStrings(prevans, ptansstr);
        console.log("initvalforsub = " + initvalforsub);
        console.log("nwsubnumstr = " + nwsubnumstr);
        console.log("ptansstr = " + ptansstr);

        console.log("MAKING THE RECURSIVE CALL OR ENDING NOW WITH:");
        console.log("nwansstr = " + nwansstr);
        console.log("finnwsnumstr = " + finnwsnumstr);
        console.log("nwremdr = " + nwremdr);
        
        const myfinrows = genFinalDataRows(prevrows, nwsubnumstr, ptansstr,
            finnwsnumstr, isdone, nwansstr);
        if (isdone)
        {
            const origsnumstr = getOrigStartNum(myfinrows, truncdsnumstr);
            console.log("origsnumstr = " + origsnumstr);

            return {"answer": nwansstr, "remainder": nwremdr,
                "divisor": divnumstr, "startnum": origsnumstr, "rows": myfinrows,
                "exact": true, "terminate": true, "precision": numdcsinans };
        }
        else
        {
            return thirdpart(finnwsnumstr, divnumstr, divtenmultiples, stopatremdr,
                numdcsinans, myfinrows, nwansstr, nwremdr);
        }
    }
    
    function thirdpart(snumstr, divnumstr, divtenmultiples, stopatremdr, numdcsinans, prevrows=null,
        prevans="0", remdr="0")
    {
        console.log("snumstr = " + snumstr);
        console.log("divnumstr = " + divnumstr);
        console.log("stopatremdr = " + stopatremdr);
        console.log("numdcsinans = " + numdcsinans);
        console.log("divtenmultiples = ", divtenmultiples);
        console.log("prevans = " + prevans);
        console.log("remdr = " + remdr);
        console.log("prevrows = ", prevrows);

        letMustBeBoolean(stopatremdr, "stopatremdr");
        letMustBeANumber(numdcsinans, "numdcsinans");
        letMustBeANumber(snumstr, "snumstr");
        letMustBeANumber(divnumstr, "divnumstr");
        letMustBeANumber(prevans, "prevans");
        letMustBeANumber(remdr, "remdr");
        letMustNotBeEmpty(divtenmultiples, "divtenmultiples");
        letNumberMustBeValid(Number(remdr), 0, Math.abs(Number(divnumstr)), false, "remdr");
        if (Number(prevans) < 0) throw new Error("previous answer must not be negative!");
        //else;//do nothing
        if (divtenmultiples.length === 10);
        else throw new Error("the divtenmultiples list must have 10 numbers on it, but it did not!");
        

        //RETURN: WE NEED THE ANSWER, THE REMAINDER, THE DIVISOR, AND THE ROWS,
        //THE NUMBER OF DECIMAL PLACES THAT WE STOPED AT,
        //AND IF THE ANSWER IS EXACT.
        //ALSO THE ROWS NEED SOME SORT OF ID AND TO KNOW WHAT DATA IS STORED ON THEM
        //THE ROWS WILL HAVE THE PARTIAL ANSWER AS WELL AS WHAT WAS BEING SUBTRACTED OR
        //THE ANSWER OF THE SUBTRACTION

        const snumisnegative = (snumstr.charAt(0) === '-');
        const divnumisnegative = (divnumstr.charAt(0) === '-');
        const ansispositive = (snumisnegative === divnumisnegative);
        const truncddivnumstr = truncateAndRemoveUnnecessaryZerosIfCan(divnumstr);
        const truncdsnumstr = truncateAndRemoveUnnecessaryZerosIfCan(snumstr);
        if (truncddivnumstr === '0') throw new Error("cannot divide by zero!");
        else if (truncdsnumstr === '0')
        {
            //answer is zero
            //minus and then answer rows then
            //zero times anything is zero
            console.log("answer is zero! no remainder!");

            const finrows = (isLetEmptyNullOrUndefined(prevrows) ?
                [genMinusRowDataObject("0", "0"), genFinalAnswerRowDataObject("0", "0")] :
                prevrows.map((val) => val));
            const finsnumstr = getOrigStartNum(prevrows, truncdsnumstr);
            console.log("finrows = ", finrows);
            console.log("finsnumstr = " + finsnumstr);
            
            return {"answer": prevans, "remainder": remdr, "divisor": divnumstr, "startnum": finsnumstr,
                "rows": finrows, "exact": true, "terminate": true, "precision": numdcsinans };
        }
        else if (truncddivnumstr === '1' || truncddivnumstr === '-1')
        {
            //the answer is snum * -1 if -1 is the divnum
            const useneg = (truncddivnumstr === '-1');
            if (useneg)
            {
                //answer is -snum
                //also these are the only rows.
                //we will want to truncate and remove the leading and ending zeros if we can
                //for the answer
                console.log("answer is the opposite of the start number! no remainder!");
            }
            else
            {
                //answer is snum
                //we will want to truncate and remove the leading and ending zeros if we can
                //for the answer
                //also these are the only rows.
                console.log("answer is the start number! no remainder!");
            }

            if (isLetEmptyNullOrUndefined(prevrows));
            else throw new Error("prevrows must be empty, null or undefined!");
            if (truncateAndRemoveUnnecessaryZerosIfCan(remdr) === '0');
            else throw new Error("the remainder must be zero!");
            if (truncateAndRemoveUnnecessaryZerosIfCan(prevans) === '0');
            else throw new Error("the previous answer must be zero!");
            const myfinrows = [genMinusRowDataObject(truncdsnumstr, truncdsnumstr),
                genFinalAnswerRowDataObject("0", truncdsnumstr)];
            console.log("myfinrows = ", myfinrows);
            
            const mynwdivnumstr = (useneg ? truncddivnumstr.substring(1) : truncddivnumstr);
            console.log("mynwdivnumstr = " + mynwdivnumstr);

            const myansstr = (useneg ? (snumisnegative ? truncdsnumstr.substring(1) :
                "-" + truncdsnumstr) : truncdsnumstr);
            console.log("myansstr = " + myansstr);

            return {"answer": myansstr, "remainder": "0", "divisor": mynwdivnumstr,
                "startnum": myansstr, "rows": myfinrows, "exact": true, "terminate": true,
                "precision": numdcsinans };
        }
        else if (truncddivnumstr === truncdsnumstr)
        {
            //answer is 1
            //we may have an answer in addition to this and previous rows of course.
            //cannot have a non-zero remainder and where the start number and the divisor are the same
            console.log("answer is 1! no remainder!");
            
            if (truncateAndRemoveUnnecessaryZerosIfCan(remdr) === '0');
            else throw new Error("the remainder must be zero!");

            const nwansvalstr = truncAndRemZerosAddTwoStrings(prevans, "1");
            const myfinrows = genFinalDataRowsFinalAnswer(prevrows,
                truncddivnumstr, "1", "0", nwansvalstr);
            const origsnumstr = getOrigStartNum(myfinrows, truncdsnumstr);
            console.log("nwansvalstr = " + nwansvalstr);
            console.log("origsnumstr = " + origsnumstr);

            return {"answer": nwansvalstr, "remainder": "0", "divisor": truncddivnumstr,
                "startnum": origsnumstr, "rows": myfinrows, "exact": true, "terminate": true,
                "precision": numdcsinans };
        }
        else if ("-" + truncddivnumstr === truncdsnumstr || truncddivnumstr === "-" + truncdsnumstr)
        {
            //answer is -1
            console.log("answer is -1! no remainder!");

            if (isLetEmptyNullOrUndefined(prevrows));
            else throw new Error("prevrows must be empty, null or undefined!");
            if (truncateAndRemoveUnnecessaryZerosIfCan(remdr) === '0');
            else throw new Error("the remainder must be zero!");
            if (truncateAndRemoveUnnecessaryZerosIfCan(prevans) === '0');
            else throw new Error("the previous answer must be zero!");
            const myfinrows = [genMinusRowDataObject(truncdsnumstr, "-1"),
                genFinalAnswerRowDataObject("0", "-1")];
            console.log("myfinrows = ", myfinrows);

            const nwsnumstr = (snumisnegative ? truncdsnumstr : "-" + truncdsnumstr);
            const nwdivnumstr = (divnumisnegative ? truncddivnumstr.substring(1) : truncddivnumstr);
            console.log("nwsnumstr = " + nwsnumstr);
            console.log("nwdivnumstr = " + nwdivnumstr);

            return {"answer": "-1", "remainder": "0", "divisor": nwdivnumstr, "startnum": nwsnumstr,
                "rows": myfinrows, "exact": true, "terminate": true, "precision": numdcsinans };
        }
        else
        {
            //if answer is positive, do nothing, but if answer is negative
            //call again to make sure we get a positive answer...
            //but handle the return value and set it to give the negative answer
            if (ansispositive)
            {
                if (snumisnegative)
                {
                    return secondpart(truncateAndRemoveUnnecessaryZerosIfCan(snumstr.substring(1)),
                        truncateAndRemoveUnnecessaryZerosIfCan(divnumstr.substring(1)),
                        stopatremdr, numdcsinans);
                }
                //else;//do nothing
            }
            else
            {
                //answer needs to be negative...
                //we will make sure that we take the positive answer and
                //we want to make sure that the div multiples are not
                //we will ignore all of the previous work and assumes that the snum is the original
                //console.log("answer must be negative!");

                let spres = null;
                if (snumisnegative)
                {
                    spres = secondpart(truncateAndRemoveUnnecessaryZerosIfCan(snumstr.substring(1)),
                        truncddivnumstr, stopatremdr, numdcsinans);
                }
                else
                {
                    spres = secondpart(truncdsnumstr,
                        truncateAndRemoveUnnecessaryZerosIfCan(divnumstr.substring(1)),
                        stopatremdr, numdcsinans);
                }
                //console.log("need to deal with the negative answer here now!");
                //console.log("spres = ", spres);

                if (truncdsnumstr === '0') return spres;
                else
                {
                    //take the results, use the initial start number, change the answer and return
                    let mynwres = {...spres};
                    mynwres.rows = spres.rows.map((val) => val);
                    mynwres.answer = multiplyTwoStrings("-1", mynwres.answer);
                    mynwres.startnum = multiplyTwoStrings("-1", mynwres.startnum);
                    //console.log("mynwres = ", mynwres);

                    return mynwres;
                }
            }
        }
        console.log("CHECK TO SEE IF ON OUR LIST OF MULTIPLES, NOW!");


        const mxmuldataobj = getCurrentMultipleDataObject(divtenmultiples, truncdsnumstr);
        const mxmuli = mxmuldataobj.index;
        const mulval = mxmuldataobj.value;
        const mxisdone = mxmuldataobj.isdone;
        console.log("mxmuli = " + mxmuli);
        console.log("mulval = " + mulval);
        console.log("mxisdone = " + mxisdone);

        if (mxisdone)
        {
            //found our multiple and it is an exact match for what we are looking for
            //n + 1 is our partial answer
            
            //do we want the start num to be the current start number? Or the original?
            //A: THE START NUMBER MUST BE THE ORIGINAL. ROW 0 VALUE + ROW 1 VALUE
            
            //do we want the remainder to be accurate to the current remainder? Or the original?
            //even if it goes in exactly? IE if there exists such a decimal where it
            //just terminates?
            //A: IT SHOULD BE THE REMAINDER OF THE ORIGINAL PROBLEM.
            //BUT WE SHOULD INDICATE IF IT GOES IN EXACTLY OR NOT.
            //
            //
            //WE SHOULD ALSO INDICATE IF WE FORCED THE TERMINATION OF THE CALCULATION.
            //(IN THIS SPECIFIC CASE, HOWEVER, THE TERMINATION WAS NOT FORCED.)
            //
            
            console.log("found what we were looking for at n = " + mxmuli +"!");
            console.log("prevrows = ", prevrows);
            
            const nwptansstr = "" + (mxmuli + 1);
            const nwansvalstr = truncAndRemZerosAddTwoStrings(prevans, nwptansstr);
            const finrows = genFinalDataRowsFinalAnswer(prevrows, mulval, nwptansstr,
                "0", nwansvalstr);
            const origsnumstr = truncAndRemZerosAddTwoStrings(finrows[0].value, finrows[1].value);
            console.log("origsnumstr = " + origsnumstr);
            console.log("nwansvalstr = " + nwansvalstr);

            return {"answer": nwansvalstr, "remainder": remdr, "divisor": divnumstr,
                "startnum": origsnumstr, "rows": finrows, "exact": true, "terminate": true,
                "precision": numdcsinans };
        }
        //else;//safe to proceed below
        console.log("THIS IS NOT A BASE CASE!");
        
        
        let nwremdr = "0";
        if (isNumberInvalid(mxmuli, 0, 9))
        {
            //not evenly divisible IE at the remainder already...
            //this is original remainder of the problem...
            console.log("no multiple of the divisor goes into the start number evenly! " +
                "We are at the remainder!");
            console.log("stopatremdr = " + stopatremdr);
            console.log("remdr = " + remdr);
            console.log("prevans = " + prevans);

            const truncdremdr = truncateAndRemoveUnnecessaryZerosIfCan(remdr);
            if (stopatremdr)
            {
                //what if remdr is not equal to zero and we get here? ERROR.
                //what if the answer is not equal to zero and we get here? KEEP IT.
                //is the answer considered exact if the remainder is not zero? NO.
                console.log("stopping at the remainder!");

                if (truncdremdr === "0")
                {
                    console.log("the remainder going into this is zero!");

                    //the new remainder is whatever the current start number is;
                    //the new answer is whatever the previous answer was;
                    console.log("nwremainder = truncdsnumstr = " + truncdsnumstr);
                    console.log("nwanswer = prevans = " + prevans);

                    const origsnumstr = getOrigStartNum(prevrows, truncdsnumstr);
                    console.log("origsnumstr = " + origsnumstr);

                    const willterminate = decimalWillTerminate(truncddivnumstr);
                    console.log("will it terminate: " + willterminate);

                    return {"answer": prevans, "remainder": truncdsnumstr, "divisor": divnumstr,
                        "startnum": origsnumstr, "rows": prevrows, "exact": false,
                        "terminate": willterminate, "precision": numdcsinans };
                }
                else
                {
                    throw new Error("the remainder going into this must be zero, otherwise we " +
                        "failed to stop at the correct value already!");
                }
            }
            else
            {
                //make it so we can proceed below... we will need to set this in the recursive calls!
                nwremdr = ((truncdremdr === '0') ? truncdsnumstr : truncdremdr);
                console.log("nwremdr = " + nwremdr);
                console.log("truncddivnumstr = " + truncddivnumstr);
                console.log("truncdsnumstr = " + truncdsnumstr);
                console.log("not stopping at the remainder!");

                //if the decimal will terminate, but it is over our prescision what do we do?
                //in any case we should force the termination at the precision.
                //
                //do we force termination at the given prescision and
                //include a note stating that it would have terminated if given a larger precision
                //if it will terminate, that is guaranteed. If it will not, it is not guaranteed.
                //it may still terminate if the method above says it will not
                //(but this depends a lot on the start number).
                //
                //NOTE terminate is true, if the answer is exact (exact is true, IE it stopped)
                //or terminate is true if it is guaranteed to terminate based on the divisor alone.
                //terminate is false otherwise because it is impossible to determine if it will stop.
                
                //if start number does not have a decimal, then do something here...
                //if the start number does have a decimal, then do something else here...

                const snumdpti = truncdsnumstr.indexOf(".");
                const hasnodptsnum = isNumberInvalid(snumdpti, 0, truncdsnumstr.length - 1, true);
                console.log("hasnodptsnum = " + hasnodptsnum);

                if (hasnodptsnum)
                {
                    //the start number does not have a decimal point
                    // ---
                    //4|1|
                    //   |
                    //we need to add the decimal point to the start number
                    //and a zero and keep adding 0s to it until the div number goes into it
                    // -----
                    //4|1.0|
                    //- 0.8|
                    // ----|
                    //  0.2|
                    //ignore the decimal point and say 4 goes into 10 2 times
                    //generate the new subtraction row keep in mind that you multiplied by a -n power
                    //when you generate the answer and that, then this critical row
                    //will be generated correctly
                    console.log("the start number does not have a decimal point!");

                    //in order for this condition to occur: the start number less than the div number
                    //the lengths can be equal
                    //the lengths of the start number can be less than the divnumber
                    //get the length of the divnumber + 1 - length of the start number

                    const maxnumaddzeros = truncddivnumstr.length + 1 - truncdsnumstr.length;
                    console.log("maxnumaddzeros = " + maxnumaddzeros);

                    let zerosafterdptstr = "0";
                    for (let i = 0; i < maxnumaddzeros; i++)
                    {
                        let mynwsnumnodptstr = truncdsnumstr + zerosafterdptstr;
                        console.log("mynwsnumnodptstr = " + mynwsnumnodptstr);

                        let cmuldataobj = getCurrentMultipleDataObject(divtenmultiples,
                            mynwsnumnodptstr);
                        let omi = cmuldataobj.index;
                        let omval = cmuldataobj.value;
                        let isdone = cmuldataobj.isdone;
                        console.log("omi = " + omi);
                        console.log("omval = " + omval);
                        console.log("isdone = " + isdone);

                        if (isNumberInvalid(omi, 0, 9, true));
                        else
                        {
                            console.log("zerosafterdptstr.length = " + zerosafterdptstr.length);
                            
                            const mpowval = -1 * zerosafterdptstr.length;
                            const nwsubnumstr = mulValByPowOfTen(divtenmultiples[omi], mpowval);
                            const initvalforsub = truncdsnumstr + "." + zerosafterdptstr;
                            const ptansstr = mulValByPowOfTen("" + (omi + 1), mpowval);
                            console.log("mpowval = " + mpowval);
                            console.log("initvalforsub = " + initvalforsub);
                            console.log("nwsubnumstr = " + nwsubnumstr);
                            console.log("ptansstr = " + ptansstr);
                            console.log("nwremdr = " + nwremdr);

                            return genRetValOrCallAgain(truncdsnumstr, divnumstr, divtenmultiples,
                                stopatremdr, numdcsinans, nwremdr, isdone, prevrows, prevans, ptansstr,
                                initvalforsub, nwsubnumstr);
                            /*
                            const finnwsnumstr = truncAndRemZerosSubtractTwoStrings(initvalforsub,
                                nwsubnumstr);
                            const nwansstr = truncAndRemZerosAddTwoStrings(prevans, ptansstr);
                            console.log("initvalforsub = " + initvalforsub);
                            console.log("nwsubnumstr = " + nwsubnumstr);
                            console.log("ptansstr = " + ptansstr);
                            console.log("MAKING THE RECURSIVE CALL NOW WITH:");
                            console.log("nwansstr = " + nwansstr);
                            console.log("finnwsnumstr = " + finnwsnumstr);
                            console.log("nwremdr = " + nwremdr);

                            const myfinrows = genFinalDataRows(prevrows, nwsubnumstr, ptansstr,
                                finnwsnumstr, isdone, nwansstr);
                            if (isdone)
                            {
                                const origsnumstr = getOrigStartNum(myfinrows, truncdsnumstr);
                                console.log("origsnumstr = " + origsnumstr);

                                return {"answer": nwansstr, "remainder": nwremdr, "divisor": divnumstr,
                                    "startnum": origsnumstr, "rows": myfinrows, "exact": true,
                                    "terminate": true, "precision": numdcsinans };
                            }
                            else
                            {
                                return thirdpart(finnwsnumstr, divnumstr, divtenmultiples, stopatremdr,
                                    numdcsinans, myfinrows, nwansstr, nwremdr);
                            }
                            //*/
                        }

                        zerosafterdptstr += "0";
                        console.log("NEW zerosafterdptstr = " + zerosafterdptstr);
                    }//end of i for loop

                    throw new Error("THE NEW START NUMBER MUST HAVE BEEN GREATER THAN OR EQUAL TO " +
                        "THE DIVNUM BY NOW, BUT IT WAS NOT!");
                }
                else
                {
                    //the start number has a decimal point
                    console.log("the start number has a decimal point!");
                    console.log("numdcsinans = " + numdcsinans);

                    const numdgtsafterdptsnum = truncdsnumstr.length - snumdpti - 1;
                    console.log("numdgtsafterdptsnum = " + numdgtsafterdptsnum);
                    
                    //check to see if precision is met or exceeded
                    //if precision is exceeded stop immediately
                    //if precision is less than 1, told not to stop at any number of decimal places...
                    if (numdcsinans < 1);
                    else
                    {
                        //check the precision
                        if (numdcsinans === numdgtsafterdptsnum)
                        {
                            const willterminate = decimalWillTerminate(truncddivnumstr);
                            console.log("will it terminate: " + willterminate);

                            //determine how to tell the user that the calculation was terminated early
                            //or terminated at the precison, when it would have ended
                            //if given a higher precision
                            //
                            //but if it was not guaranteed to terminate,
                            //we need to tell the user that it was terminated at the precesion
                            //and that it was not guaranteed to terminate.

                            const origsnumstr = getOrigStartNum(prevrows, truncdsnumstr);
                            console.log("origsnumstr = " + origsnumstr);

                            return {"answer": prevans, "remainder": nwremdr,
                                "divisor": divnumstr, "startnum": origsnumstr, "rows": prevrows,
                                "exact": false, "terminate": willterminate, "precision": numdcsinans };
                        }
                        else if (numdgtsafterdptsnum < numdcsinans && !(numdgtsafterdptsnum < 0));
                        else throw new Error("precision violated!");
                        //else;//do nothing safe to proceed
                    }

                    //what we are looking at
                    //there may be a previous answer, there may not be.
                    //but either way the remainder of the original problem is non-zero.

                    // -----     -------
                    //4|0.2|   67|22.11|
                    //-    |    -      |
                    // ----|     ------|
                    //     |           |

                    //we may be able to take the start number remove the decimal point
                    //then find a multiple that is less than that new start number
                    //
                    //OR we may need to add some zeros untill the start number with decimal point
                    //removed then find a multiple that is less than the new start number

                    //how do we know if we need to add zeros?
                    //there exists no multiple of the divisor that is less than the start number...

                    //we include the whole number before the decimal point only if it is not zero
                    const wholenumsnumstr = truncdsnumstr.substring(0, snumdpti);
                    const snumstrnodptbase = ((wholenumsnumstr === "0") ? "" : wholenumsnumstr);
                    console.log("snumstrnodptbase = " + snumstrnodptbase);
                    console.log("truncdsnumstr.substring(" + (snumdpti + 1) + ") = " +
                        truncdsnumstr.substring(snumdpti + 1));
                    
                    let mytempsnumstr = snumstrnodptbase;
                    for (let i = 0; i < numdgtsafterdptsnum; i++)
                    {
                        mytempsnumstr += "" + truncdsnumstr.charAt(snumdpti + 1 + i);
                        console.log("i = " + i);
                        console.log("NEW mytempsnumstr = " + mytempsnumstr);

                        let cmuldataobj = getCurrentMultipleDataObject(divtenmultiples,
                            mytempsnumstr);
                        let omi = cmuldataobj.index;
                        let omval = cmuldataobj.value;
                        let isdone = cmuldataobj.isdone;
                        console.log("omi = " + omi);
                        console.log("omval = " + omval);
                        console.log("isdone = " + isdone);

                        if (isNumberInvalid(omi, 0, 9, true));
                        else
                        {
                            //we need to generate our new subtraction row here now...
                            //we also need to take care of the issue that we removed the decimal point
                            //now it must be inserted again at the proper location...
                            //i can tell us from where to put it back on the start number...
                            const nwsnumdpti = mytempsnumstr.length - i - 1;
                            console.log("snumdpti = " + snumdpti);
                            console.log("mytempsnumstr.length - i - 1 = nwsnumdpti = " + nwsnumdpti);
                            console.log("numdgtsafterdptsnum - i - 1 = " +
                                (numdgtsafterdptsnum - i - 1));
                            
                            //const rempartsnumstr = truncdsnumstr.substring(snumdpti + 2 + i);
                            //const fintempnumstr = mytempsnumstr.substring(0, nwsnumdpti) + "." +
                            //    mytempsnumstr.substring(nwsnumdpti) + rempartsnumstr;
                            //console.log("rempartsnumstr = " + rempartsnumstr);
                            //console.log("fintempnumstr = " + fintempnumstr);

                            //now generate the correct omvalstr from the given string
                            //and decimal point position
                            const omvaldpti = omval.length - i - 1;
                            const omvalwithdpt = omval.substring(0, omvaldpti) + "." +
                                omval.substring(omvaldpti);
                            const ptansstr = mulValByPowOfTen("" + (omi + 1), -1 * (i + 1));
                            console.log("omvaldpti = " + omvaldpti);
                            console.log("ptans = " + ptansstr);
                            console.log("truncdsnumstr = " + truncdsnumstr);
                            console.log("omvalwithdpt = " + omvalwithdpt);

                            return genRetValOrCallAgain(truncdsnumstr, divnumstr, divtenmultiples,
                                stopatremdr, numdcsinans, nwremdr, isdone, prevrows, prevans, ptansstr,
                                truncdsnumstr, omvalwithdpt);
                            /*
                            const nwsnumstr = truncAndRemZerosSubtractTwoStrings(truncdsnumstr,
                                omvalwithdpt);
                            console.log("MAKING THE RECURSIVE CALL NOW WITH:");
                            console.log("nwremdr = " + nwremdr);
                            console.log("nwsnumstr = " + nwsnumstr);
                            
                            const nwansstr = truncAndRemZerosAddTwoStrings(prevans, ptansstr);
                            console.log("nwansstr = " + nwansstr);
                            console.log("prevrows = ", prevrows);
                            
                            const myfinrows = genFinalDataRows(prevrows, omvalwithdpt, ptansstr,
                                nwsnumstr, isdone, nwansstr);
                            if (isdone)
                            {
                                const origsnumstr = getOrigStartNum(myfinrows, truncdsnumstr);
                                console.log("origsnumstr = " + origsnumstr);

                                return {"answer": nwansstr, "remainder": nwremdr,
                                    "divisor": divnumstr, "startnum": origsnumstr, "rows": myfinrows,
                                    "exact": true, "terminate": true, "precision": numdcsinans };
                            }
                            else
                            {
                                return thirdpart(nwsnumstr, divnumstr, divtenmultiples, stopatremdr,
                                    numdcsinans, myfinrows, nwansstr, nwremdr);
                            }
                            //*/
                        }
                    }//end of first i for loop
                    console.log("AFTER i FOR LOOP!");
                    console.log("mytempsnumstr = " + mytempsnumstr);
                    console.log("mytempsnumstr.length = " + mytempsnumstr.length);
                    console.log("truncddivnumstr.length = " + truncddivnumstr.length);

                    const truncdtempsnumstr = truncateAndRemoveUnnecessaryZerosIfCan(mytempsnumstr);
                    console.log("truncdtempsnumstr = " + truncdtempsnumstr);
                    console.log("truncdtempsnumstr.length = " + truncdtempsnumstr.length);

                    //now we need to add zeros
                    const maxnumaddzeros = truncddivnumstr.length + 1 - truncdtempsnumstr.length;
                    console.log("maxnumaddzeros = " + maxnumaddzeros);

                    let zerosafterdptstr = "0";
                    for (let i = 0; i < maxnumaddzeros; i++)
                    {
                        let mynwsnumnodptstr = truncdtempsnumstr + zerosafterdptstr;
                        console.log("mynwsnumnodptstr = " + mynwsnumnodptstr);

                        let cmuldataobj = getCurrentMultipleDataObject(divtenmultiples,
                            mynwsnumnodptstr);
                        let omi = cmuldataobj.index;
                        let omval = cmuldataobj.value;
                        let isdone = cmuldataobj.isdone;
                        console.log("omi = " + omi);
                        console.log("omval = " + omval);
                        console.log("isdone = " + isdone);

                        if (isNumberInvalid(omi, 0, 9, true));
                        else
                        {
                            console.log("zerosafterdptstr.length = " + zerosafterdptstr.length);
                            
                            const mpowval = -1 * (zerosafterdptstr.length + numdgtsafterdptsnum);
                            const nwsubnumstr = mulValByPowOfTen(divtenmultiples[omi], mpowval);
                            const initvalforsub = truncdsnumstr + zerosafterdptstr;
                            const ptansstr = mulValByPowOfTen("" + (omi + 1), mpowval);
                            console.log("mpowval = " + mpowval);
                            console.log("initvalforsub = " + initvalforsub);
                            console.log("nwsubnumstr = " + nwsubnumstr);
                            console.log("ptansstr = " + ptansstr);
                            
                            return genRetValOrCallAgain(truncdsnumstr, divnumstr, divtenmultiples,
                                stopatremdr, numdcsinans, nwremdr, isdone, prevrows, prevans, ptansstr,
                                initvalforsub, nwsubnumstr);
                            /*
                            const finnwsnumstr = truncAndRemZerosSubtractTwoStrings(initvalforsub,
                                nwsubnumstr);
                            const nwansstr = truncAndRemZerosAddTwoStrings(prevans, ptansstr);
                            console.log("MAKING THE RECURSIVE CALL NOW WITH:");
                            console.log("nwansstr = " + nwansstr);
                            console.log("finnwsnumstr = " + finnwsnumstr);
                            console.log("nwremdr = " + nwremdr);
                            
                            const myfinrows = genFinalDataRows(prevrows, nwsubnumstr, ptansstr,
                                finnwsnumstr, isdone, nwansstr);
                            if (isdone)
                            {
                                const origsnumstr = getOrigStartNum(myfinrows, truncdsnumstr);
                                console.log("origsnumstr = " + origsnumstr);

                                return {"answer": nwansstr, "remainder": nwremdr,
                                    "divisor": divnumstr, "startnum": origsnumstr, "rows": myfinrows,
                                    "exact": true, "terminate": true, "precision": numdcsinans };
                            }
                            else
                            {
                                return thirdpart(finnwsnumstr, divnumstr, divtenmultiples, stopatremdr,
                                    numdcsinans, myfinrows, nwansstr, nwremdr);
                            }
                            //*/
                        }

                        zerosafterdptstr += "0";
                        console.log("NEW zerosafterdptstr = " + zerosafterdptstr);
                    }//end of second i for loop

                    throw new Error("THE NEW START NUMBER MUST HAVE BEEN GREATER THAN OR EQUAL TO " +
                        "THE DIVNUM BY NOW, BUT IT WAS NOT!");
                }
            }
        }
        else
        {
            //at least one of the multiples of the divisor goes into the start num
            console.log("at least one of the multiples of the divisor goes into the start num!");
            
            //do other stuff here...
            console.log("truncddivnumstr = " + truncddivnumstr);
            console.log("truncdsnumstr = " + truncdsnumstr);

            //see if the divisor goes into the first few digits of the snum
            //snum will never be less than the divisor if it has made it here
            //that means divisor < snum the equal case above has already been handled
            //if they have the same length, then a small amount of the divisor often 1
            //will go into the snum
            //using the index above we will know if at least 10 goes in or not
            //if more than 10 goes in, use a different strategy

            //if one or both have decimal points, just do the first case regardless
            const snumdpti = truncdsnumstr.indexOf(".");
            const divnumdpti = truncddivnumstr.indexOf(".");
            const snumstrhasnodpt = isNumberInvalid(snumdpti, 0, truncdsnumstr.length - 1, true);
            const divnumstrhasnodpt = isNumberInvalid(divnumdpti, 0, truncddivnumstr.length - 1, true);
            console.log("snumstrhasnodpt = " + snumstrhasnodpt);
            console.log("divnumstrhasnodpt = " + divnumstrhasnodpt);

            if (mxmuli < 9 || !snumstrhasnodpt || !divnumstrhasnodpt)
            {
                //we know it must be less than 10 times that goes into it, so take it out directly
                //the answer will be more than zero!
                //assuming no remainder here...
                console.log("index is less than 9!");

                return genRetValOrCallAgain(truncdsnumstr, divnumstr, divtenmultiples, stopatremdr,
                    numdcsinans, "0", false, prevrows, prevans, "" + (mxmuli + 1),
                    truncdsnumstr, divtenmultiples[mxmuli]);
                /*
                const nwsnumstr = truncAndRemZerosSubtractTwoStrings(truncdsnumstr,
                    divtenmultiples[mxmuli]);
                const nwansstr = truncAndRemZerosAddTwoStrings(prevans, "" + (mxmuli + 1));
                console.log("prevrows = ", prevrows);
                console.log("MAKING THE RECURSIVE CALL HERE NOW!");
                console.log("nwsnumstr = " + nwsnumstr);
                console.log("nwansstr = " + nwansstr);
                
                const myfinrows = genFinalDataRowsPartialAnswer(prevrows,
                    divtenmultiples[mxmuli], "" + (mxmuli + 1), nwsnumstr);
                
                return thirdpart(nwsnumstr, divnumstr, divtenmultiples, stopatremdr, numdcsinans,
                    myfinrows, nwansstr, "0");
                //*/
            }
            else
            {
                //need to figure out if it is only 10, or more than 10 here...
                //find a number that the divisor goes into
                console.log("NOW FIND A NUMBER THAT THE DIVISOR GOES INTO!");

                for (let i = truncddivnumstr.length; i < truncdsnumstr.length + 1; i++)
                {
                    let tempnumstr = ((i === truncdsnumstr.length) ?
                        truncdsnumstr : truncdsnumstr.substring(0, i));
                    let tempnum = Number(tempnumstr);
                    console.log("i = " + i);
                    console.log("tempnumstr = " + tempnumstr);

                    if (tempnum < Number(truncddivnumstr));
                    else
                    {
                        //need to figure out which multiple it is!
                        console.log("NOW FIGURE OUT WHICH MULTIPLE IT IS!");

                        let cmuldataobj = getCurrentMultipleDataObject(divtenmultiples,
                            tempnumstr);
                        let omi = cmuldataobj.index;
                        let omval = cmuldataobj.value;
                        let isdone = cmuldataobj.isdone;
                        console.log("omi = " + omi);
                        console.log("omval = " + omval);
                        console.log("isdone = " + isdone);

                        letNumberMustBeValid(omi, 0, 9, true, "omi");

                        //multiple val + 0s and . if needed where
                        //IE need to figure out what power of ten this needs to be multiplied by
                        //then this will be our new subtraction value...
                        //42/3 the first row is going to be 30; 42-30=12
                        //assuming no remainder here...
                        
                        const mpowval = truncdsnumstr.length - i;
                        console.log("truncdsnumstr.length - i = " + mpowval);
                        
                        const mynwptansvalstr = mulValByPowOfTen("" + (omi + 1), mpowval);
                        const mynwsnumstr = mulValByPowOfTen(omval, mpowval);
                        console.log("mynwptansvalstr = " + mynwptansvalstr);
                        console.log("mynwsnumstr = " + mynwsnumstr);
                        
                        return genRetValOrCallAgain(truncdsnumstr, divnumstr, divtenmultiples,
                            stopatremdr, numdcsinans, "0", false, prevrows, prevans, mynwptansvalstr,
                            truncdsnumstr, mynwsnumstr);
                        /*
                        const myansval = truncAndRemZerosAddTwoStrings(prevans, mynwptansvalstr);
                        const finnwsnumstr = truncAndRemZerosSubtractTwoStrings(truncdsnumstr,
                            mynwsnumstr);
                        console.log("mynwptansvalstr = " + mynwptansvalstr);
                        console.log("mynwsnumstr = " + mynwsnumstr);
                        console.log("myansval = " + myansval);
                        console.log("finnwsnumstr = " + finnwsnumstr);

                        const myfinrows = genFinalDataRowsPartialAnswer(prevrows,
                            mynwsnumstr, myansval, finnwsnumstr);
                        
                        console.log("MAKING THE RECURSIVE CALL HERE NOW!");
                        console.log("myansval = " + myansval);
                        console.log("finnwsnumstr = " + finnwsnumstr);
                        console.log("myfinrows = ", myfinrows);

                        return thirdpart(finnwsnumstr, divnumstr, divtenmultiples, stopatremdr,
                            numdcsinans, myfinrows, myansval, "0");
                        //*/
                    }
                }//end of i for loop

                throw new Error("we must have found at least one number that the divisor " +
                    "goes into, but we did not!");
            }
        }
    }

    function secondpart(snumstr, divnumstr, stopatremdr, numdcsinans)
    {
        const truncddivnumstr = truncateAndRemoveUnnecessaryZerosIfCan(divnumstr);
        if (truncddivnumstr === 0) throw new Error("cannot divide by zero!");
        //else;//do nothing

        const snumisnegative = (snumstr.charAt(0) === '-');
        const divnumisnegative = (divnumstr.charAt(0) === '-');
        const ansispositive = (snumisnegative === divnumisnegative);
        const truncdsnumstr = truncateAndRemoveUnnecessaryZerosIfCan(snumstr);
        if (ansispositive)
        {
            //console.log("answer is positive!");
            
            if (snumisnegative)
            {
                //console.log("both start and divisor numbers are negative!");

                return secondpart(snumstr.substring(1), divnumstr.substring(1),
                    stopatremdr, numdcsinans);
            }
            //else;//do nothing
        }
        else
        {
            //answer needs to be negative...
            //we will make sure that we take the positive answer and
            //we want to make sure that the div multiples are not
            //console.log("the answer must be negative!");

            let spres = null;
            if (snumisnegative)
            {
                //console.log("start number is negative!");

                spres = secondpart(truncateAndRemoveUnnecessaryZerosIfCan(snumstr.substring(1)),
                    truncddivnumstr, stopatremdr, numdcsinans);
            }
            else
            {
                //console.log("the divisor is negative!");

                spres = secondpart(truncdsnumstr,
                    truncateAndRemoveUnnecessaryZerosIfCan(divnumstr.substring(1)),
                    stopatremdr, numdcsinans);
            }
            //console.log("need to deal with the negative answer here now!");
            //console.log("spres = ", spres);

            if (truncdsnumstr === '0') return spres;
            else
            {
                //take the results, use the initial start number, change the answer and return
                let mynwres = {...spres};
                mynwres.rows = spres.rows.map((val) => val);
                mynwres.answer = multiplyTwoStrings("-1", mynwres.answer);
                mynwres.startnum = multiplyTwoStrings("-1", mynwres.startnum);
                //console.log("mynwres = ", mynwres);

                return mynwres;
            }
        }

        //generate the ten multiples
        let divnummltpls = [];
        for (let k = 0; k < 10; k++)
        {
            divnummltpls.push(multiplyTwoStrings(truncddivnumstr, "" + (k + 1)));
        }
        //console.log("divnummltpls = ", divnummltpls);

        return thirdpart(truncdsnumstr, truncddivnumstr, divnummltpls, stopatremdr, numdcsinans,
            null, "0", "0");
    }

    function firstpart(snumstr, divnumstr, stopatremdr, numdcsinans)
    {
        let nwstartobj = getAndSetNewStartNumAndDivisorNum(snumstr, divnumstr);
        //return newGenRows(nwstartobj.snum, nwstartobj.divnum, true, stopatrem, numdecsstop);
        return secondpart("" + nwstartobj.snum, "" + nwstartobj.divnum, stopatremdr, numdcsinans);
    }

    function moddivison(snumstr, divnumstr, numdcsinans)
    {
        return firstpart(snumstr, divnumstr, true, numdcsinans);
    }


    function testMyLongDivisionProgram()
    {
        //RULE: cannot divide by 0
        //RULE: zero divided by anything other than zero is zero
        //RULE: anything divided by 1 is itself
        //RULE: anything divided by -1 is -1*itself
        //RULE: anything divided by itself is 1
        //RULE: anything divided by -1*itself is -1
        //RULE: decimal points in the divisor will be removed before division begins
        //
        //1/3 is a repeating, non-terminating decimal (NEED TO KNOW WHEN TO STOP)
        //WE ALSO WANT TO KNOW WHAT THE REMAINDER IS
        //WE MAY WANT TO STOP AT THE REMAINDER AND NOT GET A DECIMAL
        //IF THE REMAINDER IS 0, STOP THERE
        //WE MAY ALSO WANT TO STOP AT A CERTAIN NUMBER OF PLACES OR
        //WHEN A REPEATING DECIMAL IS DISCOVERED
        //
        //RETURN: WE NEED THE ANSWER, THE REMAINDER, THE DIVISOR, AND THE ROWS,
        //THE NUMBER OF DECIMAL PLACES THAT WE STOPED AT,
        //AND IF THE ANSWER IS EXACT.
        //ALSO THE ROWS NEED SOME SORT OF ID AND TO KNOW WHAT DATA IS STORED ON THEM
        //THE ROWS WILL HAVE THE PARTIAL ANSWER AS WELL AS WHAT WAS BEING SUBTRACTED OR
        //THE ANSWER OF THE SUBTRACTION
        //
        const myfunc = firstpart;
        const stopatremdr = false;
        const numdcsinans = 15;
        
        const rundividebyzerotest = false;
        if (rundividebyzerotest)
        {
            let errfnd = false;
            try
            {
                console.log(myfunc("1", "0", stopatremdr, numdcsinans));//error cannot divide by zero
            }
            catch(merr)
            {
                errfnd = true;
                console.log("test past!");
            }
            if (errfnd);
            else throw new Error("divide by zero test failed!");
        }
        //else;//do nothing
        
        const runtruncatetests = false;
        if (runtruncatetests)
        {
            console.log(truncateAndRemoveUnnecessaryZerosIfCan("0000000001"));//1
            console.log(truncateAndRemoveUnnecessaryZerosIfCan("000000000.00000000"));//0
            console.log(truncateAndRemoveUnnecessaryZerosIfCan("-000000000.00000000"));//0
            console.log(myfunc("0000000001", "1", stopatremdr, numdcsinans));//1
            console.log(myfunc("1", "0000000001", stopatremdr, numdcsinans));//1
        }
        //else;//do nothing

        const tenmultiplesofeight = ["8", "16", "24", "32", "40", "48", "56", "64", "72", "80"];
        const tenmultiplesoffive = ["5", "10", "15", "20", "25", "30", "35", "40", "45", "50"];
        const tenmultiplesofone = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
        const tenmultiplesoftwo = ["2", "4", "6", "8", "10", "12", "14", "16", "18", "20"];
        const tenmultiplesofthree = ["3", "6", "9", "12", "15", "18", "21", "24", "27", "30"];
        const tenmultiplesoftwentyseven = ['27', '54', '81', '108', '135', '162', '189', '216',
            '243', '270'];
        
        const runtesttwo = true;
        if (runtesttwo)
        {
            console.log("init snum = 1720");
            console.log("divisor = 8");

            const minusrowaptwo = genMinusRowDataObject("1600", "200");//prevans = 0
            const ansrowaptwo = genPartialAnswerRowDataObject("120");
            const minusrowbptwo = genMinusRowDataObject("80", "10");//prevans = 200
            const ansrowbptwo = genPartialAnswerRowDataObject("40");
            //genMinusRowDataObject("40", "5");//prevans = 210
            //genFinalAnswerRowDataObject("0", "215");
            const crowsarrptwo = [minusrowaptwo, ansrowaptwo, minusrowbptwo, ansrowbptwo];
            console.log("prevans = 0");
            console.log(minusrowaptwo);
            console.log(ansrowaptwo);
            console.log("prevans = 200");
            console.log(minusrowbptwo);
            console.log(ansrowbptwo);
            console.log(crowsarrptwo);
            console.log(thirdpart("40", "8", tenmultiplesofeight, stopatremdr, numdcsinans,
                crowsarrptwo, "210", "0"));//1720/8=215
            
            const myzeroanststrows = [minusrowaptwo, ansrowaptwo, minusrowbptwo, ansrowbptwo,
                genMinusRowDataObject("40", "5"),
                genFinalAnswerRowDataObject("0", "215")
            ];
            console.log("myzeroanststrows = ", myzeroanststrows);

            console.log(thirdpart("0", "8", tenmultiplesofeight, stopatremdr, numdcsinans,
                myzeroanststrows, "215", "0"));
            console.log(myfunc("1600", "8", stopatremdr, numdcsinans));//200
            console.log(myfunc("120", "8", stopatremdr, numdcsinans));//15
            console.log(myfunc("80", "8", stopatremdr, numdcsinans));//10
            console.log(myfunc("40", "8", stopatremdr, numdcsinans));//5
            console.log(myfunc("1720", "8", stopatremdr, numdcsinans));//215
        }
        //else;//do nothing
        
        const runtestthree = true;
        if (runtestthree)
        {
            console.log("init snum = 105");
            console.log("divisor = 5");
            
            const minusrowapone = genMinusRowDataObject("100", "20");
            const ansrowapone = genAnswerRowDataObject("5", false, "0");
            console.log(minusrowapone);
            console.log(ansrowapone);

            const crowsarrpone = [minusrowapone, ansrowapone];
            console.log(crowsarrpone);
            console.log(thirdpart("5", "5", tenmultiplesoffive, stopatremdr, numdcsinans,
                crowsarrpone, "20"));//105/5=21;
            console.log(myfunc("105", "5", stopatremdr, numdcsinans));//21
        }
        //else;//do nothing
        
        const runnegativetests = true;
        if (runnegativetests)
        {
            console.log(myfunc("-4", "-2", stopatremdr, numdcsinans));//2
            console.log(myfunc("-4", "2", stopatremdr, numdcsinans));//-2
            console.log(thirdpart("-4", "2", tenmultiplesoftwo, stopatremdr, numdcsinans,
                null, "0", "0"));
            console.log(myfunc("3", "-1", stopatremdr, numdcsinans));//-3
            console.log(thirdpart("3", "-1", tenmultiplesofone, stopatremdr, numdcsinans,
                null, "0", "0"));
            console.log(thirdpart("3", "-3", tenmultiplesofthree, stopatremdr, numdcsinans,
                null, "0", "0"));
            console.log(thirdpart("-3", "3", tenmultiplesofthree, stopatremdr, numdcsinans,
                null, "0", "0"));
        }
        //else;//do nothing

        const runbasecases = true;
        if (runbasecases)
        {
            console.log(myfunc("0", "1", stopatremdr, numdcsinans));//0
            console.log(myfunc("0", "-1", stopatremdr, numdcsinans));//0
            console.log(myfunc("3", "1", stopatremdr, numdcsinans));//3
            console.log(myfunc("3", "-1", stopatremdr, numdcsinans));//-3
            console.log(myfunc("3", "3", stopatremdr, numdcsinans));//1
            console.log(myfunc("3", "-3", stopatremdr, numdcsinans));//-1
            console.log(myfunc("-3", "3", stopatremdr, numdcsinans));//-1
        }
        //else;//do nothing

        const runstopatremdrtests = true;//IE MODULAR DIVISION TESTS (NO DECIMALS)
        if (runstopatremdrtests)
        {
            console.log(myfunc("104", "27", true, numdcsinans));
            
            const minusrowapthree = genMinusRowDataObject("81", "3");
            const answerrowapthree = genPartialAnswerRowDataObject("23");
            const myprevrowspthree = [minusrowapthree, answerrowapthree];
            console.log(thirdpart("23", "27", tenmultiplesoftwentyseven, true, numdcsinans,
                myprevrowspthree, "3", "0"));//104-81=23
            console.log(myfunc("22.11", "67", true, numdcsinans));//if at rem: 22.11 otherwise 0.33
            console.log(myfunc("1", "4", true, numdcsinans));//if at rem: 1 otherwise 0.25
        }
        //else;//do nothing
        
        const runtestsnoremdrbutmorethanonecall = true;
        if (runtestsnoremdrbutmorethanonecall)
        {
            console.log(myfunc("105", "5", stopatremdr, numdcsinans));//21
            console.log(myfunc("81", "27", stopatremdr, numdcsinans));//3
            console.log(myfunc("125", "5", stopatremdr, numdcsinans));//25
            console.log(myfunc("1720", "8", stopatremdr, numdcsinans));//215
            console.log(myfunc("1600", "8", stopatremdr, numdcsinans));//200
            console.log(myfunc("120", "8", stopatremdr, numdcsinans));//15
            console.log(myfunc("80", "8", stopatremdr, numdcsinans));//10
            console.log(myfunc("40", "8", stopatremdr, numdcsinans));//5
            console.log(myfunc("42", "3", stopatremdr, numdcsinans));//14
        }
        //else;//do nothing

        const rundectonodecnorembutmorethanonecalltests = true;
        if (rundectonodecnorembutmorethanonecalltests)
        {
            console.log(myfunc("12.5", "0.5", stopatremdr, numdcsinans));//25
        }
        //else;//do nothing

        const runtestsmorethanonecallwithremdrbutterminatingdec = true;
        if (runtestsmorethanonecallwithremdrbutterminatingdec)
        {
            //console.log(myfunc("2.211", "6.7", stopatremdr, numdcsinans));//0.33
            console.log(myfunc("22.11", "67", stopatremdr, numdcsinans));//0.33
            console.log(myfunc("1", "4", stopatremdr, numdcsinans));//0.25
            console.log(myfunc("2", "4", stopatremdr, numdcsinans));//0.5 or 0.50
            console.log(myfunc("3", "4", stopatremdr, numdcsinans));//0.75
            console.log(myfunc("126", "125", stopatremdr, numdcsinans));//1+1/125 = 1.008
        }
        //else;//do nothing

        //if the divisor is an integer and is a perfect power of 0,1,2,5,10 it will terminate.
        //else it might not terminate.
        //It could, but may not for example 15/30 does, but 10/30 does not.

        const runprecisiontest = true;
        if (runprecisiontest)
        {
            console.log(myfunc("3", "4", stopatremdr, 1));//0.75 precision results 0.7 or 0.8
        }
        //else;//do nothing

        const runtestswithnonterminatingdecs = true;
        if (runtestswithnonterminatingdecs)
        {
            console.log(myfunc("104", "27", stopatremdr, numdcsinans));//3+(23/27) between 7 and 8/9
            console.log(myfunc("1", "3", stopatremdr, numdcsinans));//0.33333333333333333333...
        }
        //else;//do nothing
        
        throw new Error("NEED TO CHECK THE RESULTS!");
    }
    
    //BELOW VERSION DOES NOT WORK

    //NOT DONE YET WITH THESE 1-25-2025 9:45 PM MST

    /*
    function genMinusRow(val)
    {
        return (<tr><td style={{textAlign: "right"}}>-</td>
            <td style={{borderRight: "1px solid black"}}>{val}</td></tr>);
    }

    function genAnswerRow(val, pansval)
    {
        return (<tr><td></td>
            <td style={{borderTop: "1px solid black", borderRight: "1px solid black"}}>
                {val}</td><td>{pansval}</td></tr>);
    }

    function genRowsRepeatUntil(snum, divnum, tenmultiples, prevans="0", stopatrmdr=false, numdcs=15)
    {
        console.log("snum = " + snum);
        console.log("divnum = " + divnum);
        console.log("stopatrmdr = " + stopatrmdr);
        console.log("numdcs = " + numdcs);
        console.log("prevans = " + prevans);
        
        if (divnum === 0 || divnum === "0") throw new Error("cannot divide by zero!");
        if (snum === 0 || snum === "0") return [genMinusRow(0), genAnswerRow(0, prevans)];
        else if (Number(divnum) === Number(snum)) return [genMinusRow(divnum), genAnswerRow(0, 1)];
        else if (Number(snum) < 0) throw new Error("the start number must not be negative!");
        else
        {
            if (tenmultiples === undefined || tenmultiples === null || tenmultiples.length != 10)
            {
                throw new Error("tenmultiples must not be empty null or undefined and must " +
                    "have 10 items on it, but it did not!");
            }
            //else;//do nothing

            //125
            //012
            let snumstr = "" + snum;
            let dptindxonsnum = snumstr.indexOf(".");
            console.log("dptindxonsnum = " + dptindxonsnum);

            let crosseddpt = false;
            for (let k = 0; k < snumstr.length; k++)
            {
                let mysubsnumstr = null;
                if (k + 1 < snumstr.length) mysubsnumstr = snumstr.substring(0, k + 1);
                else mysubsnumstr = snumstr.substring(0);
                console.log("mysubsnumstr = " + mysubsnumstr);

                //going over the decimal point is a problem which we need to deal with
                if (-1 < dptindxonsnum && k === dptindxonsnum)
                {
                    //crosses over the decimal point
                    crosseddpt = true;
                    if (stopatrmdr) return [genMinusRow(0), genAnswerRow(snum)];
                    else console.log("crossed the decimal point at k = " + k + "!");
                    //else;//do nothing answer has 0.something in it
                }
                else
                {
                    //are any multiples of divnum less than the digits if so use the max
                    console.log("crosseddpt = " + crosseddpt);

                    if (crosseddpt)
                    {
                        mysubsnumstr = mysubsnumstr.substring(0, dptindxonsnum) +
                        mysubsnumstr.substring(dptindxonsnum + 1);
                        console.log("NEW mysubsnumstr = " + mysubsnumstr);
                    }
                    //else;//do nothing
                    let mydigsnum = Number(mysubsnumstr);
                    let canuseatleastone = false;
                    let mxusei = -1;
                    for (let m = 0; m < tenmultiples.length; m++)
                    {
                        if (mydigsnum < tenmultiples[m])
                        {
                            if (0 < m)
                            {
                                mxusei = m - 1;
                                canuseatleastone = true;
                            }
                            //else;//do nothing
                            break;
                        }
                        else
                        {
                            //tenmultiples[m] <= mydigsnum
                            if (canuseatleastone);
                            else canuseatleastone = true;
                            if (mxusei < m) mxusei = m;
                            //else;//do nothing
                        }
                    }//end of m for loop
                    console.log("mydigsnum = " + mydigsnum);
                    console.log("canuseatleastone = " + canuseatleastone);
                    console.log("mxusei = " + mxusei);

                    if (canuseatleastone)
                    {
                        if (mxusei < 0 || tenmultiples.length - 1 < mxusei)
                        {
                            throw new Error("mxusei is invalid because we claimed to be able to use " +
                                "one either that or the claim is wrong!");
                        }
                        //else;//do nothing
                    }
                    else
                    {
                        if (mxusei < 0 || tenmultiples.length - 1 < mxusei);
                        else
                        {
                            throw new Error("claimed to not to be able to use it, but the " +
                                "mxusei is invalid!");
                        }
                    }
                    if (canuseatleastone)
                    {
                        console.log("k = " + k);
                        console.log("mysubsnumstr = " + mysubsnumstr);
                        console.log("dptindxonsnum = " + dptindxonsnum);
                        console.log("multipletobeused = tenmultiples[" + mxusei + "] = " +
                            tenmultiples[mxusei]);
                        console.log("(mxusei + 1) = " + (mxusei + 1));

                        //determine the power of 10 to be used in the answer and this
                        //well what is the diff from dp
                        //note: tenmultiples will not have a dp
                        let diff = dptindxonsnum - k;
                        console.log("diff = " + diff);

                        //commented for storage error made my own method
                        //const myanspten = Math.pow(10, diff);
                        //console.log("myanspten = " + myanspten);
                        //console.log(tenmultiples[mxusei] * myanspten);
                        //console.log((mxusei + 1) * myanspten);//does not get stored right

                        let mynwtmpstr = mulValByPowOfTen(tenmultiples[mxusei], diff);
                        let mynwansptstr = mulValByPowOfTen((mxusei + 1), diff);
                        console.log("mynwtmpstr = " + mynwtmpstr);
                        console.log("mynwansptstr = " + mynwansptstr);

                        let nwsnumstr = subtractTwoStrings(snumstr, mynwtmpstr);
                        let nwansstr = ((prevans === 0 || prevans === "0") ? mynwansptstr :
                            addTwoStrings("" + prevans, mynwansptstr));
                        let nwrws = [genMinusRow(mynwtmpstr), genAnswerRow(nwsnumstr, nwansstr)];
                        console.log("OLD snum = " + snum);
                        console.log("nwsnumstr = " + nwsnumstr);
                        console.log("nwansstr = " + nwansstr);
                        console.warn("RESULTS:");
                        console.warn("SUBROW: mynwtmpstr = " + mynwtmpstr);
                        console.warn("ANSROW: nwsnumstr = " + nwsnumstr +
                            " AND ans = nwansstr = " + nwansstr);
                        if (truncateAndRemoveUnnecessaryZerosIfCan(nwsnumstr) === '0') return nwrws;
                        else
                        {
                            console.warn("MAKING THE RECURSIVE CALL NOW!");
                            debugger;
                            let mytemprws = genRowsRepeatUntil(nwsnumstr, divnum, tenmultiples,
                                nwansstr, stopatrmdr, numdcs);
                            mytemprws.forEach((rwval) => nwrws.push(rwval));
                            return nwrws;
                        }
                    }
                    //else;//do nothing
                }
            }//end of k for loop

            //since we could not use any of the multiples
            //we need to add to our snumstr
            //if snum does not already have a decimal point add it, first
            //then add a zero afterwards
            let nwsnumstr = "" + snum;
            if (isNumberInvalid(dptindxonsnum, 0, snumstr.length - 1)) nwsnumstr += ".";
            //else;//do nothing
            nwsnumstr += "0";
            console.log("nwsnumstr = " + nwsnumstr);
            console.warn("MAKING THE RECURSIVE CALL NOW!");
            debugger;
            return genRowsRepeatUntil(nwsnumstr, divnum, tenmultiples, prevans, stopatrmdr, numdcs);
        }
    }

    function newGenRows(snum, divnum, isfcall=true, stopatrmdr=false, numdcs=15)
    {
        console.log("snum = " + snum);
        console.log("divnum = " + divnum);
        console.log("stopatrmdr = " + stopatrmdr);
        console.log("numdcs = " + numdcs);
        
        if (divnum === 0 || divnum === "0") throw new Error("cannot divide by zero!");
        if (snum === 0 || snum === "0") return [genMinusRow(0), genAnswerRow(0)];
        else if (Number(divnum) === Number(snum)) return [genMinusRow(divnum), genAnswerRow(0)];
        else if (Number(snum) < 0)
        {
            //still need to multiply the answer by negative 1
            return newGenRows(snum * (-1), divnum, true, stopatrmdr, numdcs);
        }
        else
        {
            let mydivnumstr = "" + divnum;
            let mysnumstr = "" + snum;
            console.log("mysnumstr = " + mysnumstr);
            console.log("mydivnumstr = " + mydivnumstr);
            console.log("mysnumstr.length = " + mysnumstr.length);
            console.log("mydivnumstr.length = " + mydivnumstr.length);

            let deptindx = mydivnumstr.indexOf(".");
            console.log("deptindx = " + deptindx);

            let nodptindiv = (deptindx < 0 || mydivnumstr.length - 1 < deptindx);
            if (nodptindiv);
            else
            {
                //6.7
                //012
                // ^
                let tempdivstr =  mydivnumstr.substring(deptindx + 1);
                console.log("tempdivstr = " + tempdivstr);
                console.log("tempdivstr.length = " + tempdivstr.length);

                let nwsnum = mulValByPowOfTen(snum, tempdivstr.length);
                let nwdivnum = mulValByPowOfTen(divnum, tempdivstr.length);
                if (isfcall)
                {
                    setStartNum(nwsnum);
                    setDivisor(nwdivnum);
                }
                //else;//do nothing
                return newGenRows(nwsnum, nwdivnum, false, stopatrmdr, numdcs);
            }

            //now list 10 multiples of divnum
            let divnummltpls = [];
            for (let k = 0; k < 10; k++) divnummltpls.push(Number(divnum) * (k + 1));
            console.log("divnummltpls = ", divnummltpls);

            return genRowsRepeatUntil(snum, divnum, divnummltpls, 0, stopatrmdr, numdcs);
        }
    }

    function genRows(snum, divnum, isfcall=true, stopatrmdr=false, numdcs=15)
    {
        console.log("snum = " + snum);
        console.log("divnum = " + divnum);
        console.log("isfcall = " + isfcall);
        console.log("stopatrmdr = " + stopatrmdr);
        console.log("numdcs = " + numdcs);
        
        if (divnum === 0 || divnum === "0") throw new Error("cannot divide by zero!");
        if (snum === 0 || snum === "0") return [genMinusRow(0), genAnswerRow(0)];
        else
        {
            if (Number(divnum) === Number(snum)) return [genMinusRow(divnum), genAnswerRow(0)];
            else
            {
                //if the divnum has n digits take the n + 1 digits on snum and
                //see if what that divided by divnum is
                //N = dq + r
                let mydivnumstr = "" + divnum;
                let mysnumstr = "" + snum;
                console.log("mysnumstr = " + mysnumstr);
                console.log("mydivnumstr = " + mydivnumstr);
                console.log("mysnumstr.length = " + mysnumstr.length);
                console.log("mydivnumstr.length = " + mydivnumstr.length);

                let deptindx = mydivnumstr.indexOf(".");
                console.log("deptindx = " + deptindx);

                let nodptindiv = (deptindx < 0 || mydivnumstr.length - 1 < deptindx);
                if (nodptindiv);
                else
                {
                    //6.7
                    //012
                    // ^
                    let tempdivstr =  mydivnumstr.substring(deptindx + 1);
                    console.log("tempdivstr = " + tempdivstr);
                    console.log("tempdivstr.length = " + tempdivstr.length);

                    const mymulcnst = Math.pow(10, tempdivstr.length);
                    if (isfcall)
                    {
                        setStartNum(Number(snum) * mymulcnst);
                        setDivisor(Number(divnum) * mymulcnst);
                    }
                    //else;//do nothing
                    return genRows(Number(snum) * mymulcnst, Number(divnum) * mymulcnst, false,
                        stopatrmdr, numdcs);
                }

                //now list 10 multiples of divnum
                let divnummltpls = [];
                for (let k = 0; k < 10; k++) divnummltpls.push(Number(divnum) * (k + 1));
                console.log("divnummltpls = ", divnummltpls);

                //if our number is less than the integer part on the start_num,
                //then figure out what to subtract
                let dptindxonsnum = mysnumstr.indexOf(".");
                let nodptsnumindiv = (dptindxonsnum < 0 || mysnumstr.length - 1 < dptindxonsnum);
                if (nodptsnumindiv);
                else
                {
                    let mywholesnum = Number(mysnumstr.substring(0, dptindxonsnum));
                    if (Number(divnum) < mywholesnum)
                    {
                        //it goes in at least once... figure out how many times
                        //67 < 221 we look at the multiples and see which one it is
                        let useval = 0;
                        let addonansval = 0;
                        for (let k = 0; k < divnummltpls.length; k++)
                        {
                            if (divnummltpls[k] < mywholesnum)
                            {
                                if (k + 1 < divnummltpls.length)
                                {
                                    if (mywholesnum < divnummltpls[k + 1])
                                    {
                                        useval = divnummltpls[k];
                                        addonansval = k + 1;
                                        break;
                                    }
                                    else if (mywholesnum === divnummltpls[k + 1])
                                    {
                                        useval = divnummltpls[k + 1];
                                        addonansval = k + 2;
                                        break;
                                    }
                                    //else;//do nothing
                                }
                                //else;//do nothing
                            }
                            else if (divnummltpls[k] === mywholesnum)
                            {
                                useval = divnummltpls[k];
                                addonansval = k + 1;
                                break;
                            }
                            else
                            {
                                if (k < 1)
                                {
                                    useval = 0;
                                    addonansval = 0;
                                }
                                else
                                {
                                    useval = divnummltpls[k - 1];
                                    addonansval = k;
                                }
                                break;
                            }
                        }//end of k for loop
                        console.log("useval = " + useval);
                        console.log("addonansval = " + addonansval);
                    }
                    else if (Number(divnum) === mywholesnum)
                    {
                        let myrws = [genMinusRow(divnum), genAnswerRow(snum - divnum)];
                        let temprws = genRows(snum - divnum, divnum, false, stopatrmdr, numdcs);
                        temprws.forEach((val) => myrws.push(val));
                        return myrws;
                    }
                    else
                    {
                        //do something else here...
                    }
                }

                //step#1 if divisior has a decimal get rid of it by multiplying by 10 each time
                //step#2 your start number may still have a decimal number in it
                //step#3 take the whole number of the start_num and divide it by divnum
                //we start with our number of digits and see if it goes into that
                //if not check and see if it goes into the next digit
                //if 5 < 1 no so bring down next digit
                //if 5 < 10 yes so figure out the multiple that is less than or equal to that
                //this will be in the first place of the answer
                //then subtract
                //
                //5 does not go into 1, but it does go into 10 2 times
                //if it does not go into it, then zero.something


                let useval = 0;
                let answnumaddval = 0;
                for (let k = 0; k + 2 < Infinity; k++)
                {
                    let nval = Number((k + 1) * divnum);
                    let kval = Number((k + 2) * divnum);
                    console.log("nval = " + nval + " and kval = " + kval);
                    console.log("snum = " + snum);

                    if (nval < Number(snum))
                    {
                        if (Number(snum) < kval)
                        {
                            //use nval
                            console.log("nval < snum < kval!");
                            console.log("k = " + k);
                            useval = nval;
                            answnumaddval = k + 1;
                            break;
                        }
                        //else;//do nothing
                    }
                    else if (nval === Number(snum))
                    {
                        //use nval
                        console.log("nval matches snum!");
                        console.log("k = " + k);
                        useval = nval;
                        answnumaddval = k + 1;
                        break;
                    }
                    else
                    {
                        //use the one before...
                        console.log("we must use the one before!");
                        console.log("k = " + k);
                        let okval = Number(k * divnum);
                        useval = okval;
                        answnumaddval = k;
                        break;
                    }
                }//end of k for loop
                console.log("useval = " + useval);
                console.log("answnumaddval = " + answnumaddval);

                if (useval === Number(snum)) return [genMinusRow(useval), genAnswerRow(0)];
                else if (useval < Number(snum))
                {
                    let myrws = [genMinusRow(useval), genAnswerRow(snum - useval)];
                    //let temprws = genRows(snum - useval, divnum, false, stopatrmdr, numdcs);
                    return myrws;
                }
                else throw new Error("useval must be less than or equal to the start number!");
            }
        }
    }

    function mystartcalltorows(snum, divnum, stopatrem, numdecsstop)
    {
        let nwstartobj = getAndSetNewStartNumAndDivisorNum(snum, divnum);
        return newGenRows(nwstartobj.snum, nwstartobj.divnum, true, stopatrem, numdecsstop);
    }
    //*/

    function newGenMinusElementRow(rindx, rwdataobj)
    {
        //value is what we are subtracting, partialanswer is the part of the answer
        //we need to display the minus sign, the value we are subtracting,
        //we might also want to include the partial answer...
        //minus row index will always be even 0, 2, 4, etc
        letMustBeANumber(rindx, "rindx");
        letMustBeDefinedAndNotNull(rwdataobj, "rwdataobj");
        if (rindx < 0) throw new Error("rindx must be at least zero!");
        else if (rindx % 2 === 0);
        else throw new Error("rindx must be even!");
        const minusrowkynm = "minusrow" + (rindx / 2);
        return (<tr key={minusrowkynm}>
            <td key={minusrowkynm + "label"}></td>
            <td key={minusrowkynm + "minus"} style={{textAlign: "right"}}>-</td>
            <td key={minusrowkynm + "subval"} style={{borderRight: "1px solid black"}}>
                {rwdataobj.value}</td>
            <td key={minusrowkynm + "partialanswerval"}>+ {rwdataobj.partialanswer}</td></tr>);
    }

    function newGenAnswerElementRow(rindx, mylongdivisiondataobj)
    {
        //answer row will always be odd
        //if on the last row print out remainder and display the answer
        //otherwise nothing where the remainder would be and empty answer row spot too
        letMustBeANumber(rindx, "rindx");
        letMustBeDefinedAndNotNull(mylongdivisiondataobj, "mylongdivisiondataobj");
        letMustBeDefinedAndNotNull(mylongdivisiondataobj.rows, "mylongdivisiondataobj.rows");
        letNumberMustBeValid(rindx, 0, mylongdivisiondataobj.rows.length - 1, true, "rindx");
        if (rindx % 2 === 1);
        else throw new Error("rindx must be odd!");
        const isnotlastrow = (rindx + 1 < mylongdivisiondataobj.rows.length);
        const ansrowkynm = "answerrow" + ((rindx + 1) / 2);
        const rwdataobj = mylongdivisiondataobj.rows[rindx];
        return (<tr key={ansrowkynm}>
            <td key={ansrowkynm + "label"}></td>
            <td key={ansrowkynm + "empty1"} style={{textAlign: "right"}}>
                {isnotlastrow ? "" : "remainder: "}</td>
            <td key={ansrowkynm + "ansval"}
                style={{borderTop: "1px solid black", borderRight: "1px solid black"}}>
                {rwdataobj.value}</td><td key={ansrowkynm + "finalanswer"}>
                    {isnotlastrow ? "" : "= " + mylongdivisiondataobj.answer}</td></tr>);
    }

    function getAndGenRowsMain(snumstr, divnumstr, stopatremdr, numdcsinans)
    {
        const mylongdivisiondataobj = firstpart(snumstr, divnumstr, stopatremdr, numdcsinans);
        console.log("mylongdivisiondataobj = ", mylongdivisiondataobj);

        letMustBeDefinedAndNotNull(mylongdivisiondataobj, "mylongdivisiondataobj");

        //now take the data rows and generate each row based on what we need
        const mynewfindisplayrows = (isLetEmptyNullOrUndefined(mylongdivisiondataobj.rows) ? null :
            mylongdivisiondataobj.rows.map((rwdataobj, rindx) => {
                console.log("rwdataobj = ", rwdataobj);
                console.log("rindx = " + rindx);

                if (rwdataobj.isminusrow) return newGenMinusElementRow(rindx, rwdataobj);
                else return newGenAnswerElementRow(rindx, mylongdivisiondataobj);
        }));
        console.log("mynewfindisplayrows = ", mynewfindisplayrows);

        //throw new Error("NOT DONE YET WITH GENERATING THE RETURN VALUE!");
        return {"elementrows": mynewfindisplayrows, "resultdataobject": mylongdivisiondataobj};
    }

    function callFuncWithValAndClearError(funcname, val)
    {
        funcname(val);
        if (showerror) setShowError(false);
        //else;//do nothing
    }
    
    //testAddingOrSubtractingStrings();
    //testMultiplyTwoStrings();
    //testMyLongDivisionProgram();

    //FINISHING TO DO LIST:
    //NOTE: MAY TURN THIS INTO A CALCULATOR APP

    const resobject = (run ? getAndGenRowsMain(startnum, divisor, usemoddiv, numdcs) : null);
    const mybdyrows = (run ? resobject.elementrows : null);
    return (<div>
        <table style={{display: "inline-block"}}>
            <thead></thead>
            <tbody>
                <tr>
                    <td style={{textAlign: "right"}}>Num Decimals: </td>
                    <td><input id="numdecimalsinput" type="number" step="1" min="0" name="numdecimals"
                        placeholder="numdecimals" value={numdcs} onChange={(event) => {
                            callFuncWithValAndClearError(setPrecision, Number(event.target.value));
                        }} /></td>
                    <td>{run ? usemoddiv ? resobject.resultdataobject.remainder :
                        resobject.resultdataobject.answer : "0"}</td>
                    <td><button onClick={(event) => {
                        callFuncWithValAndClearError(setUseModDiv, !usemoddiv);
                    }}>{usemoddiv ? "Normal Division" : "Modular Division"}</button></td>
                </tr>
                <tr>
                    <td style={{textAlign: "right"}}>Problem: </td>
                    <td><input type="number" step="any" placeholder="divisor" value={divisor}
                        onChange={(event) => {
                            //console.log("new divisior value: " + event.target.value);

                            if (event.target.value === 0 || event.target.value === "0")
                            {
                                if (showerror);
                                else setShowError(true);
                                console.error("cannot divide by zero!");
                            }
                            else callFuncWithValAndClearError(setDivisor, event.target.value);
                        }} /></td>
                    <td style={{borderLeft: "1px solid black", borderRight: "1px solid black",
                        borderTop: "1px solid black"}}>
                            <input type="number" step="any" placeholder="startnum" value={startnum}
                                onChange={(event) => {
                                    callFuncWithValAndClearError(setStartNum, event.target.value);
                            }} /></td>
                    <td><button onClick={(event) => callFuncWithValAndClearError(setRun, !run) }>
                        {run ? "clear" : "run"}</button></td>
                </tr>
                {mybdyrows}
            </tbody>
        </table>
        {showerror ? (<b><p style={{color: "red"}}>
            Error: Cannot Divide By Zero! Note: Clicking run again, chaning the start 
            number, changing the precision, or changing the type of dision will clear the error!
            But if you change the divisor it must be something other than 1 and 0
            to clear the error!</p></b>) : null}
    </div>);
}

export default App;