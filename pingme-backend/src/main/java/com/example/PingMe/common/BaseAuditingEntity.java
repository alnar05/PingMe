package com.example.PingMe.common;

import jakarta.persistence.Column;
import jakarta.persistence.EntityListeners;
import jakarta.persistence.MappedSuperclass;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDateTime;

@MappedSuperclass
@EntityListeners(AuditingEntityListener.class)
public class BaseAuditingEntity {
    @CreatedDate
    @Column(name = "created_date", updatable = false, nullable = false)
    private LocalDateTime createdDate;

    @LastModifiedDate
    @Column(name = "last_modified_date", insertable = false)
    private LocalDateTime lastModifiedDate;


    // Getters, Setters
    public LocalDateTime getCreatedDate() {
        return createdDate;
    }

    public void setCreatedDate(LocalDateTime createdDate) {
        this.createdDate = createdDate;
    }

    public LocalDateTime getLastModifiedDate() {
        return lastModifiedDate;
    }

    public void setLastModifiedDate(LocalDateTime lastModifiedDate) {
        this.lastModifiedDate = lastModifiedDate;
    }

    // Constructors
    public BaseAuditingEntity() {
    }

    public BaseAuditingEntity(LocalDateTime createdDate, LocalDateTime lastModifiedDate) {
        this.createdDate = createdDate;
        this.lastModifiedDate = lastModifiedDate;
    }

    // Protected constructor for builder
    protected BaseAuditingEntity(Builder<?> builder) {
        this.createdDate = builder.createdDate;
        this.lastModifiedDate = builder.lastModifiedDate;
    }

    // Abstract Builder class
    public static abstract class Builder<T extends Builder<T>> {

        private LocalDateTime createdDate;
        private LocalDateTime lastModifiedDate;
        protected Builder() {
        }

        @SuppressWarnings("unchecked")
        protected T self() {
            return (T) this;
        }

        public T createdDate(LocalDateTime createdDate) {
            this.createdDate = createdDate;
            return self();
        }

        public T lastModifiedDate(LocalDateTime lastModifiedDate) {
            this.lastModifiedDate = lastModifiedDate;
            return self();
        }

        public abstract BaseAuditingEntity build();

    }

//    // Static builder method - SECOND OPTION
//    public static BaseAuditingEntityBuilder builder() {
//        return new BaseAuditingEntityBuilder();
//    }
//
//    // Concrete Builder class - SECOND OPTION
//    public static class BaseAuditingEntityBuilder extends Builder<BaseAuditingEntityBuilder> {
//        @Override
//        public BaseAuditingEntity build() {
//            return new BaseAuditingEntity(this);
//        }
//    }


}
