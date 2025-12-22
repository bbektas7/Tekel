using System.Globalization;
using System.Text;
using System.Text.RegularExpressions;

namespace TekelBayim.Shared.Helpers;

/// <summary>
/// Slug üretimi için yardımcı sınıf
/// </summary>
public static partial class SlugHelper
{
    /// <summary>
    /// Verilen metni URL-friendly slug'a dönüştürür
    /// </summary>
    public static string GenerateSlug(string text)
    {
        if (string.IsNullOrWhiteSpace(text))
            return string.Empty;

        // Küçük harfe çevir
        var slug = text.ToLowerInvariant();

        // Türkçe karakterleri dönüştür
        slug = ReplaceTurkishCharacters(slug);

        // Diacritic'leri kaldır
        slug = RemoveDiacritics(slug);

        // Alfanumerik olmayan karakterleri tire ile değiştir
        slug = NonAlphanumericRegex().Replace(slug, "-");

        // Birden fazla tireyi tek tireye indir
        slug = MultipleHyphensRegex().Replace(slug, "-");

        // Baş ve sondaki tireleri kaldır
        slug = slug.Trim('-');

        return slug;
    }

    private static string ReplaceTurkishCharacters(string text)
    {
        var turkishChars = new Dictionary<char, char>
        {
            { 'ş', 's' }, { 'Ş', 's' },
            { 'ı', 'i' }, { 'İ', 'i' },
            { 'ğ', 'g' }, { 'Ğ', 'g' },
            { 'ü', 'u' }, { 'Ü', 'u' },
            { 'ö', 'o' }, { 'Ö', 'o' },
            { 'ç', 'c' }, { 'Ç', 'c' }
        };

        var sb = new StringBuilder(text.Length);
        foreach (var c in text)
        {
            sb.Append(turkishChars.TryGetValue(c, out var replacement) ? replacement : c);
        }

        return sb.ToString();
    }

    private static string RemoveDiacritics(string text)
    {
        var normalizedString = text.Normalize(NormalizationForm.FormD);
        var sb = new StringBuilder();

        foreach (var c in normalizedString)
        {
            var unicodeCategory = CharUnicodeInfo.GetUnicodeCategory(c);
            if (unicodeCategory != UnicodeCategory.NonSpacingMark)
            {
                sb.Append(c);
            }
        }

        return sb.ToString().Normalize(NormalizationForm.FormC);
    }

    [GeneratedRegex(@"[^a-z0-9\s-]")]
    private static partial Regex NonAlphanumericRegex();

    [GeneratedRegex(@"[\s-]+")]
    private static partial Regex MultipleHyphensRegex();
}
