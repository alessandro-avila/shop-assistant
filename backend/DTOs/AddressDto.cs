using System.ComponentModel.DataAnnotations;

namespace ShopAssistant.Api.DTOs;

/// <summary>
/// Data Transfer Object for shipping address information.
/// Serialized to JSON and stored in Orders.ShippingAddress column.
/// </summary>
public class AddressDto
{
    /// <summary>
    /// Full name of the recipient.
    /// </summary>
    /// <example>John Doe</example>
    [Required(ErrorMessage = "Full name is required")]
    [StringLength(200, MinimumLength = 2, ErrorMessage = "Full name must be between 2 and 200 characters")]
    public required string FullName { get; set; }

    /// <summary>
    /// Email address for order confirmation and updates.
    /// </summary>
    /// <example>john.doe@example.com</example>
    [Required(ErrorMessage = "Email is required")]
    [EmailAddress(ErrorMessage = "Invalid email format")]
    [StringLength(200, ErrorMessage = "Email cannot exceed 200 characters")]
    public required string Email { get; set; }

    /// <summary>
    /// Phone number for delivery contact. Must be at least 10 digits.
    /// </summary>
    /// <example>555-123-4567</example>
    [Required(ErrorMessage = "Phone number is required")]
    [RegularExpression(@"^[\d\s()+-]{10,}$", ErrorMessage = "Phone number must contain at least 10 digits")]
    [StringLength(50, ErrorMessage = "Phone number cannot exceed 50 characters")]
    public required string Phone { get; set; }

    /// <summary>
    /// Street address including apartment/suite number if applicable.
    /// </summary>
    /// <example>123 Main Street, Apt 4B</example>
    [Required(ErrorMessage = "Street address is required")]
    [StringLength(500, MinimumLength = 5, ErrorMessage = "Street address must be between 5 and 500 characters")]
    public required string StreetAddress { get; set; }

    /// <summary>
    /// City name.
    /// </summary>
    /// <example>Springfield</example>
    [Required(ErrorMessage = "City is required")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "City must be between 2 and 100 characters")]
    public required string City { get; set; }

    /// <summary>
    /// State or province.
    /// </summary>
    /// <example>IL</example>
    [Required(ErrorMessage = "State is required")]
    [StringLength(100, MinimumLength = 2, ErrorMessage = "State must be between 2 and 100 characters")]
    public required string State { get; set; }

    /// <summary>
    /// Postal code or ZIP code.
    /// </summary>
    /// <example>62701</example>
    [Required(ErrorMessage = "Postal code is required")]
    [RegularExpression(@"^[A-Za-z0-9\s-]{3,20}$", ErrorMessage = "Postal code must be 3-20 alphanumeric characters")]
    [StringLength(20, MinimumLength = 3, ErrorMessage = "Postal code must be between 3 and 20 characters")]
    public required string PostalCode { get; set; }

    /// <summary>
    /// Country name. Defaults to "USA" if not provided.
    /// </summary>
    /// <example>USA</example>
    [StringLength(100, ErrorMessage = "Country cannot exceed 100 characters")]
    public string Country { get; set; } = "USA";
}
