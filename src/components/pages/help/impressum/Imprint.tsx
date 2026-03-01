import InfoCard from "../shared/InfoCard";

const sections = [
  {
    title: "Angaben gemäß § 5 TMG",
    content: (
      <>
        <p>
          Anbieter dieser Internet-Präsenz ist im Rechtssinn die Abteilung für
          Evolutionäre Entwicklungsgenetik der Georg-August-Universität
          Göttingen.
        </p>

        <p>
          Abt. für Evolutionäre Entwicklungsgenetik Justus-von-Liebig-Weg 11
          <br />
          37077 Göttingen
          <br />
          Germany
          <br />
          Telefon: ++49-551-39-5426
          <br />
          Fax: ++49-551-39-5416
          <br />
          gregor.bucher***bio.uni-goettingen.de
        </p>
      </>
    ),
  },
  {
    title: "Vertretungsberechtigt",
    content: <p>Prof. Dr. Gregor Bucher</p>,
  },
  {
    title: "Haftung für Inhalte",
    content: (
      <>
        <p>
          Als Diensteanbieter sind wir gemäß § 7 Abs.1 TMG für eigene Inhalte
          auf diesen Seiten nach den allgemeinen Gesetzen verantwortlich. Nach
          §§ 8 bis 10 TMG sind wir als Diensteanbieter jedoch nicht
          verpflichtet, übermittelte oder gespeicherte fremde Informationen zu
          überwachen oder nach Umständen zu forschen, die auf eine rechtswidrige
          Tätigkeit hinweisen.
        </p>
        <p></p>
        <p>
          Verpflichtungen zur Entfernung oder Sperrung der Nutzung von
          Informationen nach den allgemeinen Gesetzen bleiben hiervon unberührt.
          Eine diesbezügliche Haftung ist jedoch erst ab dem Zeitpunkt der
          Kenntnis einer konkreten Rechtsverletzung möglich. Bei Bekanntwerden
          von entsprechenden Rechtsverletzungen werden wir diese Inhalte
          umgehend entfernen.
        </p>
      </>
    ),
  },
  {
    title: "Haftung für Links",
    content: (
      <>
        <p>
          Unser Angebot enthält Links zu externen Websites Dritter, auf deren
          Inhalte wir keinen Einfluss haben. Deshalb können wir für diese
          fremden Inhalte auch keine Gewähr übernehmen. Für die Inhalte der
          verlinkten Seiten ist stets der jeweilige Anbieter oder Betreiber der
          Seiten verantwortlich. Die verlinkten Seiten wurden zum Zeitpunkt der
          Verlinkung auf mögliche Rechtsverstöße überprüft. Rechtswidrige
          Inhalte waren zum Zeitpunkt der Verlinkung nicht erkennbar.
        </p>
        <p>
          Eine permanente inhaltliche Kontrolle der verlinkten Seiten ist jedoch
          ohne konkrete Anhaltspunkte einer Rechtsverletzung nicht zumutbar. Bei
          Bekanntwerden von Rechtsverletzungen werden wir derartige Links
          umgehend entfernen.
        </p>
      </>
    ),
  },
  {
    title: "Urheber- und Kennzeichenrecht",
    content: (
      <>
        <p>
          Wir sind bestrebt, in allen Publikationen die Urheberrechte der
          verwendeten Grafiken, Tondokumente, Videosequenzen und Texte zu
          beachten, von ihr selbst erstellte Grafiken, Tondokumente,
          Videosequenzen und Texte zu nutzen oder auf lizenzfreie Grafiken,
          Tondokumente, Videosequenzen und Texte zurückzugreifen.
        </p>
        <p>
          Alle innerhalb des Internetangebotes genannten und ggf. durch Dritte
          geschützten Marken- und Warenzeichen unterliegen uneingeschränkt den
          Bestimmungen des jeweils gültigen Kennzeichenrechts und den
          Besitzrechten der jeweiligen eingetragenen Eigentümer. Allein aufgrund
          der bloßen Nennung ist nicht der Schluß zu ziehen, dass Markenzeichen
          nicht durch Rechte Dritter geschützt sind!
        </p>
        <p>
          Das Copyright für veröffentlichte, von uns selbst erstellte Objekte
          bleibt allein bei uns, sofern nicht anders angegeben. Eine
          Vervielfältigung oder Verwendung solcher Grafiken, Tondokumente,
          Videosequenzen und Texte in anderen elektronischen oder gedruckten
          Publikationen ist ohne ausdrückliche Zustimmung von uns nicht
          gestattet.
        </p>
      </>
    ),
  },
  {
    title: "Rechtswirksamkeit dieses Haftungsausschlusses",
    content: (
      <p>
        Dieser Haftungsausschluss ist als Teil des Internetangebotes zu
        betrachten, von dem aus auf diese Seite verwiesen wurde. Sofern Teile
        oder einzelne Formulierungen dieses Textes der geltenden Rechtslage
        nicht, nicht mehr oder nicht vollständig entsprechen sollten, bleiben
        die übrigen Teile des Dokumentes in ihrem Inhalt und ihrer Gültigkeit
        davon unberührt.
      </p>
    ),
  },
];

const Imprint = () => {
  return <InfoCard sections={sections} />;
};

export default Imprint;
