//
// Generated by JSON2Apex http://json2apex.herokuapp.com/
//
// The supplied json has fields with names that are not valid in apex
// and so can only be parsed with explicitly generated code, this option
// was auto selected for you.

public class TripLogDeserializeClass {

    public class Vehicle {
        public Integer id {get;set;} 
        public String url {get;set;} 
        public String lastUpdated {get;set;} 
        public String display {get;set;} 

        public Vehicle(JSONParser parser) {
            while (parser.nextToken() != System.JSONToken.END_OBJECT) {
                if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
                    String text = parser.getText();
                    if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
                        if (text == 'id') {
                            id = parser.getIntegerValue();
                        } else if (text == 'url') {
                            url = parser.getText();
                        } else if (text == 'lastUpdated') {
                            lastUpdated = parser.getText();
                        } else if (text == 'display') {
                            display = parser.getText();
                        } else {
                            System.debug(LoggingLevel.WARN, 'Vehicle consuming unrecognized property: '+text);
                            consumeObject(parser);
                        }
                    }
                }
            }
        }
    }
    
    public String message {get;set;} 
    public List<Trips> trips {get;set;} 

    public TripLogDeserializeClass(JSONParser parser) {
        while (parser.nextToken() != System.JSONToken.END_OBJECT) {
            if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
                String text = parser.getText();
                if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
                    if (text == 'message') {
                        message = parser.getText();
                    } else if (text == 'trips') {
                        trips = arrayOfTrips(parser);
                    } else {
                        System.debug(LoggingLevel.WARN, 'TripLogDeserializeClass consuming unrecognized property: '+text);
                        consumeObject(parser);
                    }
                }
            }
        }
    }
    
    public class User {
        public Integer id {get;set;} 
        public String url {get;set;} 
        public String email {get;set;} 
        public String display {get;set;} 

        public User(JSONParser parser) {
            while (parser.nextToken() != System.JSONToken.END_OBJECT) {
                if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
                    String text = parser.getText();
                    if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
                        if (text == 'id') {
                            id = parser.getIntegerValue();
                        } else if (text == 'url') {
                            url = parser.getText();
                        } else if (text == 'email') {
                            email = parser.getText();
                        } else if (text == 'display') {
                            display = parser.getText();
                        } else {
                            System.debug(LoggingLevel.WARN, 'User consuming unrecognized property: '+text);
                            consumeObject(parser);
                        }
                    }
                }
            }
        }
    }
    
    public class Trips {
        public Integer id {get;set;} 
        public String url {get;set;} 
        public String lastUpdated {get;set;} 
        public User user {get;set;} 
        public Vehicle vehicle {get;set;} 
        public String startTime {get;set;} 
        public String endTime {get;set;} 
        public Integer startOdometer {get;set;} 
        public Integer endOdometer {get;set;} 
        public Double mileage {get;set;} 
        public FromLocation fromLocation {get;set;} 
        public FromLocation toLocation {get;set;} 
        public String activity {get;set;} 
        public Double parking {get;set;} 
        public Double toll {get;set;} 
        public String tags {get;set;} 
        public String notes {get;set;} 
        public String status {get;set;} 
        public String statusUpdateTime {get;set;} 
        public User statusUpdatedBy {get;set;} 
        public String polyline {get;set;} 
        public String route {get;set;} 
        public String receipts {get;set;} 
        public String map_Z {get;set;} // in json: map
        public String trackingMethod {get;set;} 
        public String updateMethod {get;set;} 
        public Integer stayTimeMins {get;set;} 

        public Trips(JSONParser parser) {
            while (parser.nextToken() != System.JSONToken.END_OBJECT) {
                if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
                    String text = parser.getText();
                    if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
                        if (text == 'id') {
                            id = parser.getIntegerValue();
                        } else if (text == 'url') {
                            url = parser.getText();
                        } else if (text == 'lastUpdated') {
                            lastUpdated = parser.getText();
                        } else if (text == 'user') {
                            user = new User(parser);
                        } else if (text == 'vehicle') {
                            vehicle = new Vehicle(parser);
                        } else if (text == 'startTime') {
                            startTime = parser.getText();
                        } else if (text == 'endTime') {
                            endTime = parser.getText();
                        } else if (text == 'startOdometer') {
                            startOdometer = parser.getIntegerValue();
                        } else if (text == 'endOdometer') {
                            endOdometer = parser.getIntegerValue();
                        } else if (text == 'mileage') {
                            mileage = parser.getDoubleValue();
                        } else if (text == 'fromLocation') {
                            fromLocation = new FromLocation(parser);
                        } else if (text == 'toLocation') {
                            toLocation = new FromLocation(parser);
                        } else if (text == 'activity') {
                            activity = parser.getText();
                        } else if (text == 'parking') {
                            parking = parser.getDoubleValue();
                        } else if (text == 'toll') {
                            toll = parser.getDoubleValue();
                        } else if (text == 'tags') {
                            tags = parser.getText();
                        } else if (text == 'notes') {
                            notes = parser.getText();
                        } else if (text == 'status') {
                            status = parser.getText();
                        } else if (text == 'statusUpdateTime') {
                            statusUpdateTime = parser.getText();
                        } else if (text == 'statusUpdatedBy') {
                            statusUpdatedBy = new User(parser);
                        } else if (text == 'polyline') {
                            polyline = parser.getText();
                        } else if (text == 'route') {
                            route = parser.getText();
                        } else if (text == 'receipts') {
                            receipts = parser.getText();
                        } else if (text == 'map') {
                            map_Z = parser.getText();
                        } else if (text == 'trackingMethod') {
                            trackingMethod = parser.getText();
                        } else if (text == 'updateMethod') {
                            updateMethod = parser.getText();
                        } else if (text == 'stayTimeMins') {
                            stayTimeMins = parser.getIntegerValue();
                        } else {
                            System.debug(LoggingLevel.WARN, 'Trips consuming unrecognized property: '+text);
                            consumeObject(parser);
                        }
                    }
                }
            }
        }
    }
    
    public class FromLocation {
        public Integer id {get;set;} 
        public String url {get;set;} 
        public String lastUpdated {get;set;} 
        public String display {get;set;} 
        public String name {get;set;} 
        public String address {get;set;} 
        public Double latitude {get;set;} 
        public Double longitude {get;set;} 
        
        public FromLocation(JSONParser parser) {
            while (parser.nextToken() != System.JSONToken.END_OBJECT) {
                if (parser.getCurrentToken() == System.JSONToken.FIELD_NAME) {
                    String text = parser.getText();
                    if (parser.nextToken() != System.JSONToken.VALUE_NULL) {
                        if (text == 'id') {
                            id = parser.getIntegerValue();
                        } else if (text == 'url') {
                            url = parser.getText();
                        } else if (text == 'lastUpdated') {
                            lastUpdated = parser.getText();
                        } else if (text == 'display') {
                            display = parser.getText();
                        } else if (text == 'name') {
                            name = parser.getText();
                        } else if (text == 'address') {
                            address = parser.getText();
                        } else if (text == 'latitude') {
                            latitude = parser.getDoubleValue();
                        } else if (text == 'longitude') {
                            longitude = parser.getDoubleValue();
                        } else {
                            System.debug(LoggingLevel.WARN, 'FromLocation consuming unrecognized property: '+text);
                            consumeObject(parser);
                        }
                    }
                }
            }
        }
    }
    
    public static TripLogDeserializeClass parse(String json) {
        System.JSONParser parser = System.JSON.createParser(json);
        return new TripLogDeserializeClass(parser);
    }
    
    public static void consumeObject(System.JSONParser parser) {
        Integer depth = 0;
        do {
            System.JSONToken curr = parser.getCurrentToken();
            if (curr == System.JSONToken.START_OBJECT || 
                curr == System.JSONToken.START_ARRAY) {
                depth++;
            } else if (curr == System.JSONToken.END_OBJECT ||
                curr == System.JSONToken.END_ARRAY) {
                depth--;
            }
        } while (depth > 0 && parser.nextToken() != null);
    }
    private static List<Trips> arrayOfTrips(System.JSONParser p) {
        List<Trips> res = new List<Trips>();
        if (p.getCurrentToken() == null) p.nextToken();
        while (p.nextToken() != System.JSONToken.END_ARRAY) {
            res.add(new Trips(p));
        }
        return res;
    }
}