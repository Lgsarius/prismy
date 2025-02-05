export default function Impressum() {
  return (
    <div className="max-w-3xl mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Impressum</h1>
      
      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Angaben gemäß § 5 TMG</h2>
        <p>
          [Your Company Name]<br />
          [Street Address]<br />
          [Postal Code, City]<br />
          Germany
        </p>
        
        <h3 className="text-lg font-semibold mt-6">Kontakt</h3>
        <p>
          Telefon: [Your Phone]<br />
          E-Mail: [Your Email]
        </p>
        
        <h3 className="text-lg font-semibold mt-6">Handelsregister</h3>
        <p>
          Registergericht: [Court Name]<br />
          Registernummer: [Registration Number]
        </p>
        
        <h3 className="text-lg font-semibold mt-6">Umsatzsteuer-ID</h3>
        <p>
          Umsatzsteuer-Identifikationsnummer gemäß § 27 a Umsatzsteuergesetz:<br />
          [Your VAT ID]
        </p>
        
        <h3 className="text-lg font-semibold mt-6">Verantwortlich für den Inhalt nach § 55 Abs. 2 RStV</h3>
        <p>
          [Responsible Person Name]<br />
          [Address]
        </p>
      </section>
    </div>
  );
} 