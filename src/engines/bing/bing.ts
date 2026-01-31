import axios from 'axios';
import * as cheerio from 'cheerio';
import { SearchResult } from '../../types.js';

export async function searchBing(query: string, limit: number): Promise<SearchResult[]> {
    let allResults: SearchResult[] = [];
    let pn = 0;

    while (allResults.length < limit) {
        const response = await axios.get('https://www.bing.com/search', {
            params: {
                q: query,
                first: 1 + pn * 10
            },
            headers: {
                "authority": "www.bing.com",
                "ect": "3g",
                "pragma": "no-cache",
                "sec-ch-ua-arch": "\"x86\"",
                "sec-ch-ua-bitness": "\"64\"",
                "sec-ch-ua-full-version": "\"144.0.3719.92\"",
                "sec-ch-ua-full-version-list": "\"Not(A:Brand\";v=\"8.0.0.0\", \"Chromium\";v=\"144.0.7559.97\", \"Microsoft Edge\";v=\"144.0.3719.92\"",
                "sec-ch-ua-model": "\"\"",
                "sec-ch-ua-platform-version": "\"19.0.0\"",
                "sec-fetch-user": "?1",
                "upgrade-insecure-requests": "1",
                "Cookie": "_EDGE_V=1; SRCHD=AF=NOFORM; SRCHUID=V=2&GUID=090C9FBFFAF041F2BBF60D721BAC0829&dmnchg=1; MUID=3AA43AA4AEDB64B102B62F0CAFBD6578; MUIDB=3AA43AA4AEDB64B102B62F0CAFBD6578; MMCASM=ID=FBDECDE33FEF4F24BB02623420A1AD69; MSPTC=3Yus7EHRUi4-qKRstdhttQ0IPyH-5f7K6DKEBTgZkFE; SRCHUSR=DOB=20250302&T=1743667361000&DS=1&POEX=W; PPLState=1; KievRPSSecAuth=FABiBRRaTOJILtFsMkpLVWSG6AN6C/svRwNmAAAEgAAACL2QUrPoNzf2IAXnab9uZyeMULgcD2K3sEWuYaGE9Fx70VVjwtvHIkmPNut4DGttIh6T6H+h66xlG87LkL/4UQTrjyVQVllOyoOtwCwXTVhFXDr2XUuuHFmnE9aVlXvReu+ueDlH9JMJu3gCMNEcAk8+YzP4Hj44rHfj/0wE1l1+Z9QZoDYt8g1254tHb02BPJdlmydsC+GK6gS4tUtXwr+SnAhdNJaY+ITWynw6EwoXEe6HPrFsdIAk1rLcA5OyTR2Lmf5m3OYpI5lv8Zb2AaFsx18JgbcGmcQjMii/crXUFLQNU+kT1P3qhkSYBtn3AmROqtXGQ5WYsBzq1DvaTc4anSUE4Nkj3jPoG35+Njx4o8xRwF7rwnDI3Amlnf5n1uxkzuHWxWDXuccRgVJ7+8yYev2O5Ya9aGdQU4f50Kax4hNcggyTBO94BkZSkwXWuq7Mh9b6XnNbVak0Z1qWHhMwQ27Hc2VdSEpiBJ3N9w5Gj1NgmaW69vu0GQOhl0nsdgGNF3bxMlso/b6mJdc4Gd6EpmSdfFvJXyBQO8hjnTwM6czrxd/GXZUTHvWCAww/7XzVj1Iz69j3/Z2vIorkFj6JyKnthqxXjVJjMxdWYa0w8yyE0NiIkKZf5RnKC80n5jV7nQspsc7uXYIVrPpJWdxu94DyoF5rFaATrFURegvSn0BulRLlR3536oY6dq8kjDkQpljgcjKH0U8Oez9nONXCUifKeF59/gI493m3Lv5+JvjkCeSuWfjQKy9AfttU/IqCIlTQj2EbNuvcthzYwSWM4FEgCJ+WLHJl7MPL33k22zKUq6pehXmUVBoXublnNKAGkVZUehftaBM68qGs4czbu5nczTYdtvO4dPMnnhBmQOwKEsa5iS7ESihCrFjOQtFv6zDfwi+WhQe4jHrapLjvO93jcjWxBmN9vx6ZPiJ8CWdQT1Lsm03kpklDm+BnaHQXPjRCMiQdueuu7a8Pspw/Lg9imW9uG3PgEQFUqr0ganskSzc6HU9dSRDt/MCnlYK/aeNH61TQFgJNcPyKT0MxFRIkY5SdhEI67OoOie8EQOiNHlapBu6VvHO3t+urNV4efFOVlSDRmHYJ6qZu9HMNZaNB2/UqDChqL9lQg5x/nZpg+pfqXRi1fosBeK+3d9gEsbG3/NqL7PAMIrGPF6XOPsduxV21gMNQz9AUq0vhoMi87JtdyYp/EIe72Xnpl/g/HuZ6TJzQWzN/WvUajQBTZH35eZDRQQCKrgWuvm5A7JUVTwhRrKyx+/p5F7UGDJa3jMTCBGGbMZyB3CXcaFGGb72/Ycit0UuRv/5b8KRwjddFBV2nbqmkpZaGZ7DGQZSprrdMSBG3QCOkjJE+NTTN5OTjUxJmk5yKd07bDCCGeJvz1/EpSd9hSxlgWB3dBznFr1L5rxrcp5guPK6qeTyOxhLlW/E4uUDET4N/bDZBZ+FHRMN8sdsrrTy8FaJf/JBf5PtlzkpXxAn51lyC5UMO0JrLwx7gpAofT2dJF7KoCptx05yKBR0nwblVuhaFAiSRsZliqJMX8yMZ8bmGNsSSBFxXopcw36uC8MUbdDJ6ertuNzlLtdc021vSL2Km+zKgaDgaVPfaGviJishwuLsOyrb9RaSGt/wPWw++kYYy+TeOxDo0Omd/1/wxSpsuLR59FMknVoYTdd6VbrY7RnXrnvK26mlziE9WrAiM7gXU3sMQBsVrWfOocEI6pT5JfAC4X9Z1F5BLm2TzwvPzseYIaz3EIH0yH6CwFADjYq5+rylVD4vpRObIj7TxmOwkIQ==; ANON=A=DCAD66DC048D9163EE41F88DFFFFFFFF; _UR=QS=0&TQS=0&Pn=0; BFBUSR=BFBHP=0; _clck=1851vy9%7C2%7Cfy0%7C0%7C2033; _uetvid=014bb850f29211f0b44b974526751bec; _uetmsclkid=_uet4aa52d74ff7f1fd8f68a441c7c310f7a; _tarLang=default=zh-Hans; _TTSS_IN=hist=WyJjcyIsImVuIiwiemgtSGFucyIsImF1dG8tZGV0ZWN0Il0=&isADRU=0; _TTSS_OUT=hist=WyJqYSIsInpoLUhhbnMiLCJlbiJd; SNRHOP=I=&TS=; _Rwho=u=d&ts=2026-01-31; _EDGE_S=SID=214A9500DD5C6BDE1E7A83F2DC9E6A63&mkt=zh-CN; USRLOC=HS=1&ELOC=LAT=39.045677185058594|LON=-77.4847640991211|N=%E9%98%BF%E4%BB%80%E6%9C%AC%EF%BC%8C%E7%BB%B4%E5%90%89%E5%B0%BC%E4%BA%9A%E5%B7%9E|ELT=10|&BID=MjYwMTMxMTUxNDA0XzQ2NDU0YjkwM2E0MTFlNDQ4NmU5NDhlODI1MDhiYmM2Yzk1ZWUwNTg2YmM1MjRmYzY5MTFiYTdhNmE5Y2EwNzk=; dsc=order=BingPages; ak_bmsc=F331EB94F75B686706EC2337228B5567~000000000000000000000000000000~YAAQz+nHFwiH4+WbAQAAJYb5Eh557kKVc+D3DjgH6swvEdtDJek4KmZ2eK3CzR7qWu7dWlFWMDCDXPIx9T0GSYltzXG7ZRQEiHqvDoZ942eraUOCcP0g8QkMgiFLYDk5pFXwk/ByQc3UHu2Il4IOnWP5iQIVVtudVetpBY2BYKVvK3SXfh0s4EHuCB2mIVEU2VB8kWa+R7UooeOxU51/lRX9puFRaYVGngGF3Hwyjmhpbligjb/f0IT9PkjvlcfE1VdNRLsJ20zOns29fu3EZZDSBNxps1b0rn9nZL9n4NN6hLrcm4OIU7qn+IYL7VKNNOSiOPCXjjrAJg+jRhl3n5hVQWuQTbwY2MuRJRpADy9HuXosNPDR7OkCk4mRk3Oy1YiMCvrRxgNhe8=; .MSA.Auth=CfDJ8HAK7eZCYw5BifHFeUHnkJEG0tsYXSGfFjJTlKuqNcW4KlycaJs6-0ZayJqLiZZhVRmACib7jtrB0gQJUjlLMaiCNmt8jb3RzMFtaMf9pkGv4Lz-XuUNuOSw4S_ppXEWiB0FngxGlBPmMBrCs-tUvKRZDV9q22dv4hxNccSyjAw-MFg_Nh5wpymfcx7JeFXfbNw9ApovddSrrlsAAlpCO8oWv8Ek0CD6RVFdKPInsQqVAA02olHJfqGwwz4p3z2Q1kXSFrlUi0WK2zuOqvlAEdqkY311oxZjH6fWnhZ3Apcmy_c0lkRfVM9RJnDlbGcg99wFkEvKOJ4AMmDro-umsfFCcs6CutACEBF4v_ziohiSZXWw3L6OpkG8fqnr6dNO3w; _U=1sw4HtybA4wbCalqS9lJ-0S_waCdUR7fyUWgrpMLavUHZBwvm70fgqKZayb8ObigvK8O1WbUkz2hKZ5VoL3HVY2vHM7IRpLS_xs4_M7BmeHs03jP7Vlc5kdK-nZX5tfH6QYrgwqX1vvlpRc4CyYxQImfQ8OcvWBln9HBVZx5fHRv6HOrG9HXRYpVjDgtjmu7WCI5OETlM60GCmagMLQzs6A; WLS=C=193b1151bae662dc&N=u; _HPVN=CS=eyJQbiI6eyJDbiI6OCwiU3QiOjAsIlFzIjowLCJQcm9kIjoiUCJ9LCJTYyI6eyJDbiI6OCwiU3QiOjAsIlFzIjowLCJQcm9kIjoiSCJ9LCJReiI6eyJDbiI6OCwiU3QiOjAsIlFzIjowLCJQcm9kIjoiVCJ9LCJBcCI6dHJ1ZSwiTXV0ZSI6dHJ1ZSwiTGFkIjoiMjAyNi0wMS0zMVQwMDowMDowMFoiLCJJb3RkIjowLCJHd2IiOjAsIlRucyI6MCwiRGZ0IjpudWxsLCJNdnMiOjAsIkZsdCI6MCwiSW1wIjoxNSwiVG9ibiI6MH0=; GC=XoKuX7b-NwOcXKIGtPnMN1JVRV2FkupfqHjkFHggbVznaE3Qyvalge8GrcSGQo-U1JR6NyH_FfS4EW5t-XkQUQ; _SS=PC=EDGEBRV&SID=214A9500DD5C6BDE1E7A83F2DC9E6A63&R=22633&RB=22633&GB=0&RG=0&RP=22628; _RwBf=mta=0&rc=22633&rb=22633&gb=2025w17_c&rg=0&pc=22628&mtu=0&rbb=0.0&g=&cid=0&clo=0&v=1&l=2026-01-31T08:00:00.0000000Z&lft=0001-01-01T00:00:00.0000000&aof=0&ard=0001-01-01T00:00:00.0000000&rwdbt=-62135539200&rwflt=1738525531&rwaul2=0&o=16&p=sapphire&c=true&t=3165&s=2023-09-28T06:58:10.3517269+00:00&ts=2026-01-31T08:49:14.0871616+00:00&rwred=0&wls=0&wlb=0&wle=0&ccp=2&cpt=0&lka=0&lkt=0&aad=0&TH=&e=n8KC8MpXD1a7QKimw_YYxK25l7sKBa_bYegQDiDA9T-FNdIAOsFQ0urNQuqessp_VDGXm920H_DqZMDsC8ivfQ&A=DCAD66DC048D9163EE41F88DFFFFFFFF&ispd=0; ipv6=hit=1769852954849&t=4; SRCHHPGUSR=SRCHLANG=zh-Hans&PV=19.0.0&DM=1&BRW=NOTP&BRH=M&CW=555&CH=975&SCW=555&SCH=975&DPR=1.5&UTC=480&EXLTT=31&HV=1769849371&HVE=CfDJ8HAK7eZCYw5BifHFeUHnkJE1UI4tOjJh06s163mKy-YM4x3I2-uShxpxwTd1Lie08XGIyFiPQQbWSI11XYnSPlzVar-JZ_TwnjynnJ0ooahiz0IJ5JEqjV_YNVx7BP4Wm3kRksUSuQI1S8raZvwuatPkSHF_xMExxIeoX0fxkwBiWL3oejgepd47bJALamNJDA&PRVCW=1661&PRVCH=975&AV=14&ADV=14&RB=0&MB=0&BZA=0&IG=911D2A8364D949A2BE104F848144389A&PR=1.5&B=0&PREFCOL=0&WEBTHEME=2&THEME=0&P=CfDJ8BJecyNyfxpMtsfDoM3OqQuzvmeBvc8Q35s5jVqm4xcxzHja5C17stmpoH1To0rfnrhTdFRt69H1mEfXkFHNyo3KAYOroPMiztbYUCHU_cuYYAx2nGNwaG-ic_0P8fTDjUg8ACTRyD14Iu-IanTZE5qi9yv15O-qdiH3FKcjWGqxDr-HA-RPgMtvEVX1xjo2Rg0",
                "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/144.0.0.0 Safari/537.36 Edg/144.0.0.0",
                "Accept": "*/*",
                "Host": "www.bing.com",
                "Connection": "keep-alive"
            }
        });

        const $ = cheerio.load(response.data);
        const results: SearchResult[] = [];

        $('#b_content').children()
            .find('#b_results').children()
            .each((i, element) => {
                const titleElement = $(element).find('h2');
                const linkElement = $(element).find('a');
                const snippetElement = $(element).find('p').first();

                if (titleElement.length && linkElement.length) {
                    const url = linkElement.attr('href');
                    if (url && url.startsWith('http')) {

                        const sourceElement = $(element).find('.b_tpcn');
                        results.push({
                            title: titleElement.text(),
                            url: url,
                            description: snippetElement.text().trim() || '',
                            source: sourceElement.text().trim() || '',
                            engine: 'bing'
                        });
                    }
                }
            });

        allResults = allResults.concat(results);

        if (results.length === 0) {
            console.error('⚠️ No more results, ending early....');
            break;
        }

        pn += 1;
    }

    return allResults.slice(0, limit); // 截取最多 limit 个
}
