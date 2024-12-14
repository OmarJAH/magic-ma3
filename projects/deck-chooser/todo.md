# TODOs

Hier einfach sachen reinschreiben, die man noch machen will oder machen könnte, wenn man zeit hat ;)
Man kann gern die Liste nach priorität aktualisieren, also die wichtigsten sachen immer zuerst.
Aber lass di nit überwältigen vo dem ganzen zeug, einfach nach eigenem tempo/geschmack sachen picken :)

* Reine Front-end page machen, also sollte kein server.js notwendig sein. Bei dieser App geht das sicher, weil es nichts wichtiges serverseitiges gibt (z.b. eine datenbank oder synchronisierung mit anderen). Siehe das andere projekt als beispiel
* "Pagination" hinzufügen, bei den suchergebnissen sollten nicht alle 400 decks auf einmal auftauchen. Je nach layout können es um die 25/50 sein
* CSS Frameworks ausprobieren (Fabi) - Es gibt viele CSS frameworks mit denen die Page gleich viel sauberer aussieht. Es gibt auch vordefinierte Elemente usw. In der Moderne ist das "Material Design" als Konzept der Standard. Es gibt einige CSS frameworks, die material design implementieren. Kannst mal ausprobieren :) Um es nicht zu schwer zu machen, erstmal solche ausprobieren, die kein anderes framework erwarten (e.g. "Independent structures" hier https://dev.to/leonardorafael/best-material-design-3-web-frameworks-of-2024-3k45)
* Die Leute werden diese App in ihrem Browser am handy verwenden. Müssen auf die mobile ansicht unseren Fokus legen. Beim programmieren kannst du in der Developer Console deines Browsers die "Device Toolbar" einschalten und so ein handy simulieren.

Kleinere Aufgaben bzw. Geschmackssache:
* Die Logik der Filter könnma besprechen. Was man sich als user erwartet wenn man mehrere checkboxen in der gleichen kategorie anklick zb.
* Verwenden von Icons wo es geht. Ist leichter für den User und oft angenehmer für das Auge als nur Text. Für sachen wie Manasymbole, Schwierigkeit, Spieldauer haben wir in dem anderen projekt eh was zum kopieren
* Die "Cards" (also wie ein Deck dargestellt wird) können wir auch anpassen
  * Ich glaub es macht mehr sinn mit CSS nur das Bild selbst auszuwählen und die wichtigsten Infos (Nr, Mana, was wäre noch wichtig? :D diskutieren* ) in der card dazuprogrammieren. Beispiel/Philosophie: https://m3.material.io/components/cards/guidelines (ist natürlich geschmackssache, sich des mal anzuschauen is zumindest zum gefühl für design und präsentation kriegen nit schlecht)
  * (Annahme: Mobile) der user hat mobile ja kein mouse-over, da kann man eh schon klicken hab ich gesehen. Die infos vom deck sind aber ab und zu abgeschnitten. Wäre vll cool wenn beim klicken eines decks eine "extended" version der Karte angezeigt wird, wo alle infos drauf sind. In der guideline haben sie es bei "Behaviour" gut erklärt https://m3.material.io/components/cards/guidelines . Ähnliche elemente/verhalten gibt es bei Accordions, expansion panels, expanded cards, bla bla, wie sie alle heißen. In unserem Fall "sollte" nur ein deck zeitgleich expandet sein. Siehe Beispiel "Expansion panel as accordion" auf https://material.angular.io/components/expansion/examples#expansion-steps
