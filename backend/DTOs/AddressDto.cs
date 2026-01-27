namespace ShopAssistant.Api.DTOs;

/// <summary>
/// Data Transfer Object for shipping address information.
/// Serialized to JSON and stored in Orders.ShippingAddress column.
/// </summary>
public class AddressDto
{
    /// <summary>
    /// Recipient name for shipping.
    /// </summary>
    /// <example>John Doe</example>
    public required string Name { get; set; }

    /// <summary>
    /// Street address line.
    /// </summary>
    /// <example>123 Main Street, Apt 4B</example>
    public required string Address { get; set; }

    /// <summary>
    /// City name.
    /// </summary>
    /// <example>Springfield</example>
    public required string City { get; set; }

    /// <summary>
    /// State or province.
    /// </summary>
    /// <example>IL</example>
    public required string State { get; set; }

    /// <summary>
    /// ZIP or postal code.
    /// </summary>
    /// <example>62701</example>
    public required string ZipCode { get; set; }

    /// <summary>
    /// Country name.
    /// </summary>
    /// <example>USA</example>
    public required string Country { get; set; }
}
