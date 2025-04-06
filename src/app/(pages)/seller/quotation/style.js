import { StyleSheet } from '@react-pdf/renderer';

// Create PDF styles
export const styles = StyleSheet.create({
    page: {
      flexDirection: 'column',
      backgroundColor: '#ffffff',
      padding: 30,
    },
    header: {
      marginBottom: 20,
      padding: 10,
      backgroundColor: '#2563eb',
      color: 'white',
      borderRadius: 5,
    },
    title: {
      fontSize: 24,
      fontWeight: 'bold',
      color: 'white',
      marginBottom: 5,
    },
    subtitle: {
      fontSize: 14,
      color: 'white',
    },
    content: {
      margin: 10,
      padding: 10,
    },
    section: {
      marginBottom: 15,
    },
    sectionTitle: {
      fontSize: 16,
      fontWeight: 'bold',
      marginBottom: 8,
      color: '#333',
      paddingBottom: 5,
      borderBottomWidth: 1,
      borderBottomColor: '#eee',
    },
    text: {
      fontSize: 12,
      marginBottom: 5,
      color: '#333',
    },
    table: {
      display: 'flex',
      width: 'auto',
      borderStyle: 'solid',
      borderColor: '#bfbfbf',
      borderWidth: 1,
      borderRightWidth: 0,
      borderBottomWidth: 0,
      marginVertical: 10,
    },
    tableRow: {
      flexDirection: 'row',
      borderBottomWidth: 1,
      borderBottomColor: '#bfbfbf',
    },
    tableHeader: {
      backgroundColor: '#f0f0f0',
    },
    tableCell: {
      flex: 1,
      padding: 5,
      borderRightWidth: 1,
      borderRightColor: '#bfbfbf',
      fontSize: 10,
    },
    tableCellDescription: {
      flex: 3,
    },
    tableCellPrice: {
      flex: 1,
    },
    tableCellQuantity: {
      flex: 1,
    },
    tableCellAmount: {
      flex: 1,
    },
    total: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 15,
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: '#eee',
    },
    totalLabel: {
      fontSize: 14,
      fontWeight: 'bold',
      marginRight: 10,
    },
    totalValue: {
      fontSize: 14,
      fontWeight: 'bold',
    },
    footer: {
      position: 'absolute',
      bottom: 30,
      left: 30,
      right: 30,
      textAlign: 'center',
      paddingTop: 10,
      borderTopWidth: 1,
      borderTopColor: '#eee',
      fontSize: 10,
      color: '#666',
    },
  });