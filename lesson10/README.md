## Poznámky

Počítadlo návštev som prevzal od Teba.

Get article kontroluje, či už daný článok existuje v REDIS. 
- Ak áno, do responsu ho načíta odtiaľ. 
- Ak nie, načíta ho z databázy, uloží do REDIS, a do responsu ho vráti z databázy.

