# Interface Umami Sessions - Reproduction

Cette interface reproduit fidèlement l'écran des sessions d'Umami avec toutes ses fonctionnalités.

## 🎯 Fonctionnalités reproduites

### ✅ Navigation
- **Logo Umami** avec navigation par onglets
- **Onglets** : Dashboard, Websites, Reports, Settings
- **Icônes** : Mode sombre, Langue, Profil utilisateur
- **Surlignage** de l'onglet actif (Websites)

### ✅ Statistiques en temps réel
- **Total Sessions** : Nombre total de sessions
- **Active Sessions** : Sessions actives (dernières 30 min)
- **Total Visits** : Nombre total de visites
- **Total Views** : Nombre total de vues
- **Cartes colorées** avec icônes et animations

### ✅ Tableau des sessions
- **Avatars** : Cercles colorés avec initiales
- **Visits** : Nombre de visites par session
- **Views** : Nombre de vues par session
- **Country** : Drapeau + nom du pays
- **City** : Ville de la session
- **Browser** : Icône + nom du navigateur
- **OS** : Icône + système d'exploitation
- **Device** : Icône + type d'appareil
- **Last seen** : Dernière activité formatée

## 🎨 Design reproduit

### Couleurs
- **Fond principal** : `#111827` (gray-900)
- **Headers** : `#1f2937` (gray-800)
- **Bordures** : `#374151` (gray-700)
- **Texte principal** : `#ffffff`
- **Texte secondaire** : `#d1d5db` (gray-300)

### Typographie
- **Police** : System fonts (SF Pro, Segoe UI, etc.)
- **Titres** : Font-bold
- **Tableau** : Text-sm pour les données

### Interactions
- **Hover effects** : Changement de couleur au survol
- **Transitions** : Animations fluides
- **Loading states** : Spinner de chargement

## 📊 Données de test

### Sessions mockées
```typescript
interface MockSession {
  id: string;
  sessionId: string;
  visits: number;
  views: number;
  country: string;
  city: string;
  browser: string;
  os: string;
  device: string;
  lastSeen: string;
  avatarColor: string;
}
```

### Données réalistes
- **6 sessions** avec données cohérentes
- **Pays** : France, États-Unis, Allemagne, etc.
- **Villes** : Paris, Lyon, Marseille, etc.
- **Navigateurs** : Chrome, Firefox, Safari, Edge, iOS
- **OS** : Windows, macOS, Linux, iOS, Android
- **Appareils** : Laptop, Mobile, Tablet, Desktop

## 🔧 Composants créés

### Navigation
- `Navigation.tsx` - Barre de navigation principale
- Onglets interactifs avec état actif
- Icônes d'actions (mode sombre, langue, profil)

### Sessions
- `SessionsTable.tsx` - Tableau principal des sessions
- `SessionStats.tsx` - Cartes de statistiques
- `SessionAvatar.tsx` - Avatars colorés

### Icônes
- `CountryFlag.tsx` - Drapeaux des pays
- `BrowserIcon.tsx` - Icônes des navigateurs
- `OSIcon.tsx` - Icônes des systèmes d'exploitation
- `DeviceIcon.tsx` - Icônes des appareils

### Hooks
- `useSessions.ts` - Gestion des données de sessions
- Intégration avec l'API Umami
- Données de test pour la démonstration

## 🚀 Utilisation

```tsx
import { SessionsTable } from './components/SessionsTable';

function App() {
  return (
    <SessionsTable 
      websiteId="1"
      startDate="2024-01-01"
      endDate="2024-12-31"
    />
  );
}
```

## 📱 Responsive Design

- **Mobile** : Tableau avec scroll horizontal
- **Tablet** : Layout adaptatif
- **Desktop** : Interface complète

## ♿ Accessibilité

- **ARIA labels** sur tous les boutons
- **Navigation clavier** supportée
- **Contraste** respecté (WCAG AA)
- **Screen readers** compatibles

## 🎯 Fidélité à l'original

Cette reproduction respecte :
- ✅ **Layout exact** de l'interface Umami
- ✅ **Couleurs** et typographie identiques
- ✅ **Comportements** et interactions
- ✅ **Structure** des données
- ✅ **Design patterns** d'Umami

L'interface est prête pour être intégrée dans une application Umami complète !
