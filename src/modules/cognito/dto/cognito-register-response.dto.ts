import {
  AttributeListType,
  UsernameType,
} from 'aws-sdk/clients/cognitoidentityserviceprovider';

export class CognitoRegisterResponseDto {
  Username: UsernameType;
  Attributes: AttributeListType;
}
