package com.touristsafety.entity;

import javax.persistence.AttributeConverter;
import javax.persistence.Converter;

@Converter(autoApply = false)
public class RoleAttributeConverter implements AttributeConverter<Role, String> {

    @Override
    public String convertToDatabaseColumn(Role attribute) {
        if (attribute == null) {
            return Role.USER.name();
        }
        return attribute.name();
    }

    @Override
    public Role convertToEntityAttribute(String dbData) {
        if (dbData == null) {
            return Role.USER;
        }

        String normalized = dbData.trim();
        if (normalized.isEmpty()) {
            return Role.USER;
        }

        try {
            return Role.valueOf(normalized.toUpperCase());
        } catch (IllegalArgumentException ex) {
            return Role.USER;
        }
    }
}
