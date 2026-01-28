import { Card, CardHeader, CardBody } from '@/components/ui/card';
import type { BackendAddressDto } from '@/lib/types/api';

export interface ShippingAddressDisplayProps {
  address: BackendAddressDto;
}

/**
 * Shipping address display component
 * Shows formatted shipping address in a card
 */
export function ShippingAddressDisplay({ address }: ShippingAddressDisplayProps) {
  return (
    <Card>
      <CardHeader>
        <h2 className="text-lg font-semibold">Shipping Address</h2>
      </CardHeader>
      <CardBody>
        <address className="not-italic space-y-1 text-sm">
          {/* Name */}
          <div className="font-semibold text-gray-900">{address.fullName}</div>
          
          {/* Email */}
          <div className="text-gray-600">
            <a href={`mailto:${address.email}`} className="hover:text-blue-600 hover:underline">
              {address.email}
            </a>
          </div>
          
          {/* Phone */}
          <div className="text-gray-600">
            <a href={`tel:${address.phone}`} className="hover:text-blue-600 hover:underline">
              {address.phone}
            </a>
          </div>
          
          {/* Divider */}
          <div className="border-t my-3"></div>
          
          {/* Street Address */}
          <div className="text-gray-700">{address.streetAddress}</div>
          
          {/* City, State, Postal Code */}
          <div className="text-gray-700">
            {address.city}, {address.state} {address.postalCode}
          </div>
          
          {/* Country */}
          <div className="text-gray-700">{address.country}</div>
        </address>
      </CardBody>
    </Card>
  );
}
