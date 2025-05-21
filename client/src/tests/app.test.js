import { render, screen } from '@testing-library/react';
import MyApp from '../pages/_app';

// Mocking the context providers
jest.mock('../contexts/FoodBankContext', () => ({
  FoodBankProvider: ({ children }) => <div>{children}</div>,
}));

jest.mock('../contexts/CommunityGardenContext', () => ({
  CommunityGardenProvider: ({ children }) => <div>{children}</div>,
}));

jest.mock('../contexts/RecipientContext', () => ({
  RecipientProvider: ({ children }) => <div>{children}</div>,
}));

jest.mock('../contexts/GeolocationContext', () => ({
  GeolocationProvider: ({ children }) => <div>{children}</div>,
}));

jest.mock('../contexts/MapPageContext', () => ({
  MapPageProvider: ({ children }) => <div>{children}</div>,
}));

describe('MyApp', () => {
  it('renders without crashing', () => {
    // Create a mock Component
    const MockComponent = () => <div data-testid="mock-component">Test Component</div>;
    
    // Render the MyApp with the mock component and props
    render(<MyApp Component={MockComponent} pageProps={{}} />);
    
    // Check if the component renders properly
    const mockComponent = screen.getByTestId('mock-component');
    expect(mockComponent).toBeInTheDocument();
    expect(mockComponent.textContent).toBe('Test Component');
  });
});